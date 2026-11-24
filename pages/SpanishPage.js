const { runValidationConcurrent } = require('../tests/validators/spanish-validator');

class SpanishPage {
  constructor(context) {
    this.context = context;
  }

  async validate(url) {
    const results = await runValidationConcurrent([url], false, 1);
    return results[0];
  }
}

module.exports = { SpanishPage };
