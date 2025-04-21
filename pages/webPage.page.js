class WebPage {
    async open(url) {
      await browser.url(url);
    }
  
    async getValue(selector) {
      const nameElement = await $(selector);
      return nameElement.getText();
    }
  }
  
  module.exports = new WebPage();
  