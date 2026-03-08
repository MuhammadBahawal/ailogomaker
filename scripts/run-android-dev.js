const fs = require('fs');
const path = require('path');
const {spawn, spawnSync} = require('child_process');

const isWindows = process.platform === 'win32';
const executableSuffix = isWindows ? '.exe' : '';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';
const bootTimeoutMs = 180000;
const pollIntervalMs = 2000;

function getSdkRoots() {
  return [
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_HOME,
    isWindows ? path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk') : '',
  ].filter(Boolean);
}

function resolveExecutable(name, sdkDirectory) {
  const executableName = `${name}${executableSuffix}`;
  const candidates = [];

  for (const sdkRoot of getSdkRoots()) {
    candidates.push(path.join(sdkRoot, sdkDirectory, executableName));
  }

  const sdkMatch = candidates.find(candidate => fs.existsSync(candidate));

  if (sdkMatch) {
    return sdkMatch;
  }

  return executableName;
}

const adbCommand = resolveExecutable('adb', 'platform-tools');
const emulatorCommand = resolveExecutable('emulator', 'emulator');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error(stderr || stdout || `${command} exited with code ${result.status}`);
  }

  return result.stdout?.trim() ?? '';
}

function runQuietly(command, args) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
  });

  if (result.error || result.status !== 0) {
    return '';
  }

  return result.stdout?.trim() ?? '';
}

function listConnectedDevices() {
  const output = run(adbCommand, ['devices']);

  return output
    .split(/\r?\n/)
    .slice(1)
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => line.endsWith('\tdevice'))
    .map(line => line.split(/\s+/)[0]);
}

function listAvds() {
  const output = runQuietly(emulatorCommand, ['-list-avds']);

  return output
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

function startFirstAvd(avds) {
  const selectedAvd = avds[0];

  console.log(`Starting emulator: ${selectedAvd}`);

  const child = spawn(emulatorCommand, ['-avd', selectedAvd], {
    detached: true,
    stdio: 'ignore',
  });

  child.unref();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForDevice() {
  let devices = listConnectedDevices();

  if (devices.length > 0) {
    return devices[0];
  }

  const avds = listAvds();

  if (avds.length === 0) {
    throw new Error(
      'No Android device is connected. Start an emulator manually or expose the Android SDK emulator binary in PATH.',
    );
  }

  startFirstAvd(avds);

  const deadline = Date.now() + bootTimeoutMs;

  while (Date.now() < deadline) {
    await sleep(pollIntervalMs);
    devices = listConnectedDevices();

    if (devices.length > 0) {
      return devices[0];
    }
  }

  throw new Error('Timed out waiting for the emulator to appear in adb.');
}

async function waitForBoot(serial) {
  const deadline = Date.now() + bootTimeoutMs;

  while (Date.now() < deadline) {
    const bootCompleted = runQuietly(adbCommand, ['-s', serial, 'shell', 'getprop', 'sys.boot_completed']);
    const bootAnimation = runQuietly(adbCommand, ['-s', serial, 'shell', 'getprop', 'init.svc.bootanim']);

    if (bootCompleted === '1' && (!bootAnimation || bootAnimation === 'stopped')) {
      return;
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Timed out waiting for Android to finish booting on ${serial}.`);
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

async function main() {
  if (!(await metroIsRunning())) {
    throw new Error('Metro is not running on port 8081. Start it first with "npm start".');
  }

  const deviceId = await waitForDevice();

  console.log(`Using device: ${deviceId}`);
  console.log('Waiting for Android boot to finish...');

  await waitForBoot(deviceId);

  run(adbCommand, ['-s', deviceId, 'reverse', 'tcp:8081', 'tcp:8081']);

  const child = isWindows
    ? spawn(
        process.env.ComSpec || 'cmd.exe',
        ['/d', '/s', '/c', `${npxCommand} react-native run-android --no-packager --device ${deviceId}`],
        {
          stdio: 'inherit',
        },
      )
    : spawn(npxCommand, ['react-native', 'run-android', '--no-packager', '--device', deviceId], {
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
