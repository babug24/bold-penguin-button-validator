const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function readUrls(inputFile = process.env.BP_URL_FILE || 'url.csv') {
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
