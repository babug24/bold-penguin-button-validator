const { test, expect } = require('@playwright/test');
const { SpanishPage } = require('../pages/SpanishPage');
const { readUrls } = require('../utils/test-data');
const { defineCsvUrlSuite } = require('./framework/defineCsvUrlSuite');

defineCsvUrlSuite(test, expect, {
  suiteName: 'Spanish language conversion',
  caseName: 'validates Spanish conversion',
  urls: readUrls({ inputFile: 'test-data/urls.spanish.csv' }),
  createValidator: async ({ context }) => new SpanishPage(context),
  run: async (validator, { url }) => validator.validate(url),
  assert: async (result, { expect: pwExpect }) => {
    pwExpect(result.status, result.details || 'Spanish conversion validation failed').toBe('PASS');
  }
});
