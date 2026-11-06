const { test, expect } = require('@playwright/test');
const { BoldPenguinPage } = require('../pages/BoldPenguinPage');
const { readUrls } = require('../utils/test-data');

const urls = readUrls();

test.beforeEach(async ({ context }) => {
  context.setDefaultTimeout(15000);
  context.setDefaultNavigationTimeout(30000);
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.error(`Test failed: ${testInfo.title}`);
    console.error(`Artifacts: ${testInfo.outputDir}`);
  }
});

for (const [index, url] of urls.entries()) {
  test(`validates Bold Penguin CTAs: ${url}`, async ({ context }, testInfo) => {
    const boldPenguinPage = new BoldPenguinPage(context);
    const result = await boldPenguinPage.validate(url, index + 1);
    await testInfo.attach('validation-result.json', {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json'
    });

    expect(result.status, result.error || 'Bold Penguin validation failed').not.toBe('FAIL');
  });
}
