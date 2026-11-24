const { spawnSync } = require('child_process');

const mode = process.argv[2];
const supportedModes = ['sanity', 'smoke', 'regression'];

if (!supportedModes.includes(mode)) {
  console.error(`Usage: node scripts/run-playwright.js <${supportedModes.join('|')}>`);
  process.exit(1);
}

const cliPath = require.resolve('@playwright/test/cli');
const result = spawnSync(process.execPath, [cliPath, 'test', ...process.argv.slice(3)], {
  stdio: 'inherit',
  env: { ...process.env, TEST_MODE: mode }
});

if (result.error) throw result.error;
process.exit(result.status ?? 1);
