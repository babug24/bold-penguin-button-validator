# Bold Penguin Playwright Test Framework

The original CLI remains available. The hybrid Playwright Test entry point adds
desktop/mobile projects, per-URL tests from a CSV file, failure traces, and
Playwright HTML reporting.

## Install

```powershell
npm install
npx playwright install chromium
```

## Run the CSV

```powershell
npm run test:e2e
```

The default input file is `url.csv`. Use another CSV with:

```powershell
$env:BP_URL_FILE = '.\url1.csv'
npm run test:e2e
```

Run visibly with `npm run test:e2e:headed`. View the generated report with
`npx playwright show-report reports/playwright-report`.

The existing command remains available, for example:

```powershell
node .\bold-penguin-validator-v6.1.js --file .\url.csv --debug
```
