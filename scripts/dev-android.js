const path = require('path');
const {spawn, spawnSync} = require('child_process');

const isWindows = process.platform === 'win32';
const projectRoot = path.resolve(__dirname, '..');
const metroTimeoutMs = 120000;
const pollIntervalMs = 2000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function metroIsRunning() {
  try {
    const response = await fetch('http://127.0.0.1:8081/status');
    const body = await response.text();

    return response.ok && body.includes('packager-status:running');
  } catch {
    return false;
  }
}

function spawnMetroWindow() {
  if (isWindows) {
    const escapedProjectRoot = projectRoot.replace(/'/g, "''");
    const result = spawnSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        `Start-Process powershell.exe -WorkingDirectory '${escapedProjectRoot}' -ArgumentList '-NoExit','-Command','npm start'`,
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

  const child = spawn('npm', ['start'], {
    cwd: projectRoot,
    detached: true,
    stdio: 'ignore',
  });

  child.unref();
}

async function ensureMetro() {
  if (await metroIsRunning()) {
    console.log('Metro is already running on port 8081.');
    return;
  }

  console.log('Starting Metro in a separate window...');
  spawnMetroWindow();

  const deadline = Date.now() + metroTimeoutMs;

  while (Date.now() < deadline) {
    await sleep(pollIntervalMs);

    if (await metroIsRunning()) {
      console.log('Metro is ready.');
      return;
    }
  }

  throw new Error('Metro did not start on port 8081 within 120 seconds.');
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
