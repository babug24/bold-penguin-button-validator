/**
 * Small helper to generate one Playwright test per URL from a CSV.
 *
 * This keeps per-validator specs very small so you can add more validators
 * by only wiring up: createValidator + run + assert.
 */

function defineCsvUrlSuite(test, expect, options) {
  const {
    suiteName,
    caseName,
    urls,
    createValidator,
    run,
    assert,
    mode = process.env.TEST_MODE || 'regression',
    smokeUrls,
    smokeLimit = 5,
    selectUrls,
    contextTimeoutMs = 15000,
    navigationTimeoutMs = 30000,
    attachJson = true
  } = options;

  const supportedModes = ['sanity', 'smoke', 'regression'];
  if (!supportedModes.includes(mode)) {
    throw new Error(`defineCsvUrlSuite: mode must be one of ${supportedModes.join(', ')}`);
  }
  if (!suiteName) throw new Error('defineCsvUrlSuite: suiteName is required');
  if (!caseName) throw new Error('defineCsvUrlSuite: caseName is required');
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error('defineCsvUrlSuite: urls must be a non-empty array');
  }
  if (typeof createValidator !== 'function') {
    throw new Error('defineCsvUrlSuite: createValidator must be a function');
  }
  if (typeof run !== 'function') throw new Error('defineCsvUrlSuite: run must be a function');
  if (typeof assert !== 'function') throw new Error('defineCsvUrlSuite: assert must be a function');
  if (!Number.isInteger(smokeLimit) || smokeLimit < 1) {
    throw new Error('defineCsvUrlSuite: smokeLimit must be a positive integer');
  }

  const selectedUrls = selectUrls
    ? selectUrls({ mode, urls })
    : mode === 'smoke'
      ? (typeof smokeUrls === 'function' ? smokeUrls(urls) : smokeUrls || urls.slice(0, smokeLimit))
      : urls;

  if (!Array.isArray(selectedUrls) || selectedUrls.length === 0) {
    throw new Error(`defineCsvUrlSuite: no URLs selected for ${mode} mode`);
  }

  test.describe(`${suiteName} [${mode}]`, () => {
    test.beforeEach(async ({ context }) => {
      context.setDefaultTimeout(contextTimeoutMs);
      context.setDefaultNavigationTimeout(navigationTimeoutMs);
    });

    test.afterEach(async ({}, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        console.error(`Test failed: ${testInfo.title}`);
        console.error(`Artifacts: ${testInfo.outputDir}`);
      }
    });

    for (const [index, url] of selectedUrls.entries()) {
      test(`${caseName}: ${url} @${mode}`, async ({ context }, testInfo) => {
        const validator = await createValidator({ context, testInfo });
        const result = await run(validator, { context, testInfo, url, index: index + 1, mode });

        if (attachJson) {
          await testInfo.attach('validation-result.json', {
            body: JSON.stringify(result, null, 2),
            contentType: 'application/json'
          });
        }

        await assert(result, { expect, testInfo, url, index: index + 1, mode });
      });
    }
  });
}

module.exports = { defineCsvUrlSuite };
