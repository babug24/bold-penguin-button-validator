const { test, expect } = require('@playwright/test');
const { BoldPenguinPage } = require('../pages/BoldPenguinPage');
const { readUrls } = require('../utils/test-data');
const { defineCsvUrlSuite } = require('./framework/defineCsvUrlSuite');

const mode = process.env.TEST_MODE || 'regression';

defineCsvUrlSuite(test, expect, {
  suiteName: 'Bold Penguin',
  caseName: 'validates Bold Penguin CTAs',
  urls: readUrls({ mode }),
  createValidator: async ({ context }) => new BoldPenguinPage(context),
  run: async (validator, { url, index }) => validator.validate(url, index),
  assert: async (result, { expect: pwExpect }) => {
    pwExpect(result.status, result.error || 'Bold Penguin validation failed').not.toBe('FAIL');
  }
});
