const { validateUrl } = require('../tests/validators/bold-penguin-validator');

class BoldPenguinPage {
  constructor(context) {
    this.context = context;
  }

  async validate(url, index) {
    return validateUrl(this.context, url, index);
  }
}

module.exports = { BoldPenguinPage };
