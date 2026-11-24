const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function readUrls(input = {}) {
  const options = typeof input === 'string' ? { inputFile: input } : input;
  const mode = options.mode || process.env.TEST_MODE || 'regression';
  const defaultFiles = {
    sanity: 'urls.sanity.csv',
    smoke: 'urls.smoke.csv',
    regression: 'urls.regression.csv'
  };

  if (!defaultFiles[mode]) {
    throw new Error(`Unknown test mode: ${mode}. Expected smoke or regression.`);
  }

  const inputFile = options.inputFile
    || process.env.BP_URL_FILE
    || path.join(__dirname, '..', 'test-data', defaultFiles[mode]);
  const inputPath = path.resolve(inputFile);

  if (!fs.existsSync(inputPath)) {
    throw new Error(`CSV not found: ${inputPath}`);
  }

  const records = parse(fs.readFileSync(inputPath, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const urls = records
    .map(row => row.URL || row.url || row.Url)
    .filter(Boolean);

  if (!urls.length) {
    throw new Error('No URLs found. Expected URL, url, or Url CSV column.');
  }

  return urls;
}

module.exports = { readUrls };
