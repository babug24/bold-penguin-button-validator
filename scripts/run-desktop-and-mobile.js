const { spawnSync } = require('child_process');

const rawArgs = process.argv.slice(2);
const requestedModes = new Set();
const passthroughArgs = [];

for (const arg of rawArgs) {
  if (arg === '--desktop') {
    requestedModes.add('desktop');
    continue;
  }
  if (arg === '--mobile') {
    requestedModes.add('mobile');
    continue;
  }
  passthroughArgs.push(arg);
}

const modes = requestedModes.size ? [...requestedModes] : ['desktop', 'mobile'];
const playwrightCli = require.resolve('@playwright/test/cli');
let exitCode = 0;

for (const mode of modes) {
  console.log(`\n=== Running ${mode} mode ===`);
  const result = spawnSync(process.execPath, [
    playwrightCli,
    'test',
    `--project=${mode}`,
    ...passthroughArgs
  ], {
    stdio: 'inherit',
    cwd: __dirname
  });

  if (result.error) {
    console.error(`Failed to start ${mode} run: ${result.error.message}`);
    exitCode = 1;
    continue;
  }

  if (result.status !== 0) exitCode = result.status || 1;
}

console.log('\nCompleted the requested desktop/mobile validation runs.');
process.exitCode = exitCode;
