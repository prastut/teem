/**
* Use this for login
*
* Example taken from http://pavelbogomolenko.github.io/dry-principles-with-protractor.html
*/

module.exports = function(f) {
  describe('common login suite', function() {
    var random = require('./random');

    var loginButton = element(by.css('#submitButton')).click();

    afterEach(function(){
      browser.driver.executeScript("window.localStorage.clear();");
    });

    it('should login', function() {
      browser.get('/index.html');

      var login = random.emailUser();

      element(by.css('input#login')).sendKeys(login);
      element(by.css('input:enabled[type=submit]')).click();
    });

    f();
  });
}
