const { validateUrl } = require('../bold-penguin-validator-v6.1');

class BoldPenguinPage {
  constructor(context) {
    this.context = context;
  }

  async validate(url, index) {
    return validateUrl(this.context, url, index);
  }
}

module.exports = { BoldPenguinPage };
