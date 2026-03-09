const path = require('path');
const {spawn, spawnSync} = require('child_process');

const isWindows = process.platform === 'win32';
const projectRoot = path.resolve(__dirname, '..');
const metroTimeoutMs = 120000;
const pollIntervalMs = 2000;
const metroPort = 8081;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
        result.stdout?.trim() ||
        `${command} exited with code ${result.status}.`,
    );
  }

  return result.stdout?.trim() ?? '';
}

function runQuietly(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    ...options,
  });

  if (result.error || result.status !== 0) {
    return '';
  }

  return result.stdout?.trim() ?? '';
}

async function metroIsRunning() {
  try {
    const response = await fetch(`http://127.0.0.1:${metroPort}/status`);
    const body = await response.text();

    return response.ok && body.includes('packager-status:running');
  } catch {
    return false;
  }
}

function listListeningProcessIds(port) {
  const output = isWindows
    ? runQuietly('powershell.exe', [
        '-NoProfile',
        '-Command',
        `$connections = Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue; if ($connections) { $connections | Select-Object -ExpandProperty OwningProcess -Unique }`,
      ])
    : runQuietly('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']);

  return output
    .split(/\r?\n/)
    .map(line => Number.parseInt(line.trim(), 10))
    .filter(Number.isInteger);
}

function getProcessCommandLine(processId) {
  if (isWindows) {
    return runQuietly('powershell.exe', [
      '-NoProfile',
      '-Command',
      `(Get-CimInstance Win32_Process -Filter "ProcessId = ${processId}" | Select-Object -ExpandProperty CommandLine)`,
    ]);
  }

  return runQuietly('ps', ['-p', String(processId), '-o', 'command=']);
}

function isMetroCommandLine(commandLine) {
  if (!commandLine) {
    return false;
  }

  const normalized = commandLine.replace(/\\/g, '/').toLowerCase();

  return /react-native\/cli\.js"?\s+start\b/.test(normalized);
}

function killProcess(processId) {
  if (isWindows) {
    run('taskkill', ['/PID', String(processId), '/T', '/F']);
    return;
  }

  process.kill(processId, 'SIGTERM');
}

async function stopExistingMetro() {
  const processIds = listListeningProcessIds(metroPort);

  if (processIds.length === 0) {
    return false;
  }

  const listeners = processIds.map(processId => ({
    processId,
    commandLine: getProcessCommandLine(processId),
  }));

  const nonMetroListeners = listeners.filter(
    listener => !isMetroCommandLine(listener.commandLine),
  );

  if (nonMetroListeners.length > 0) {
    const blockedBy = nonMetroListeners
      .map(
        listener =>
          `PID ${listener.processId}: ${listener.commandLine || 'unknown process'}`,
      )
      .join('\n');

    throw new Error(
      `Port ${metroPort} is already in use by a non-Metro process.\n${blockedBy}`,
    );
  }

  for (const listener of listeners) {
    console.log(`Stopping stale Metro on port ${metroPort} (PID ${listener.processId})...`);
    killProcess(listener.processId);
  }

  const deadline = Date.now() + metroTimeoutMs;

  while (Date.now() < deadline) {
    if (listListeningProcessIds(metroPort).length === 0) {
      return true;
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Timed out waiting for port ${metroPort} to become free.`);
}

function spawnMetroWindow() {
  if (isWindows) {
    const escapedProjectRoot = projectRoot.replace(/'/g, "''");
    const result = spawnSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        `Start-Process powershell.exe -WorkingDirectory '${escapedProjectRoot}' -ArgumentList '-NoExit','-Command','npm run start:reset'`,
      ],
      {
        cwd: projectRoot,
        encoding: 'utf8',
      },
    );

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      throw new Error(result.stderr?.trim() || 'Failed to start Metro in a separate PowerShell window.');
    }

    return;
  }

  const child = spawn('npm', ['run', 'start:reset'], {
    cwd: projectRoot,
    detached: true,
    stdio: 'ignore',
  });

  child.unref();
}

async function ensureMetro() {
  const replacedExistingMetro = await stopExistingMetro();

  console.log(
    replacedExistingMetro
      ? 'Starting Metro in a separate window with a clean cache...'
      : 'Starting Metro in a separate window...',
  );
  spawnMetroWindow();

  const deadline = Date.now() + metroTimeoutMs;

  while (Date.now() < deadline) {
    await sleep(pollIntervalMs);

    if (await metroIsRunning()) {
      console.log('Metro is ready.');
      return;
    }
  }

  throw new Error(`Metro did not start on port ${metroPort} within 120 seconds.`);
}

async function main() {
  await ensureMetro();

  const child = spawn(process.execPath, [path.join(__dirname, 'run-android-dev.js')], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  child.on('exit', code => {
    process.exit(code ?? 1);
  });

  child.on('error', error => {
    console.error(error.message);
    process.exit(1);
  });
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
