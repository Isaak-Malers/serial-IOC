exports.config =
{
  //define the tests to run at the top of the document:
  specs: ['./example.js'],
  SELENIUM_PROMISE_MANAGER: false,

  capabilities: {
    //test with chrome:
    browserName: 'chrome',
    chromeOptions: {
      args:["--start-maximized"]
    }
  }
}
