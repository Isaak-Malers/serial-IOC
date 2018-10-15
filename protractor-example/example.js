//import serialIOC
var IOC = require("../src/serialIOC");


//set up expected conditions:
var until = protractor.ExpectedConditions;


//global test variables can go here, or they could be read in from an external file.
var url = "https://www.wikipedia.org/";
var language = '//*[@id="searchLanguage"]';
var polish = '//*[@id="searchLanguage"]/option[37]';


var searchText = '//*[@id="searchInput"]';
var searchTerm = "colorado";

var searchButton = '//*[@id="search-form"]/fieldset/button';
var articleBody = '//*[@id="mw-content-text"]';

var expectedURL = "https://en.wikipedia.org/wiki/Colorado";

describe("Wikipedia", function(){

	it("should have english search support", function(done){
		browser.waitForAngularEnabled(false);//disable protractors default flow controll.  Wikipedia is not built with angular.
		var test = new IOC();//new up an IOC object.
		test.logger.level = "trace";


		test.step("load the test url: " + url, function(){
			return browser.get(url);
		});

		test.step("wait for the page to load successfully", function(){
			return browser.sleep(500);
		});

		test.step("enter search term", function(){
			return element(by.xpath(searchText)).sendKeys(searchTerm);
		});

		test.step("click go", function(){
			return element(by.xpath(searchButton)).click();
		});

		test.step("wait for page to load", function(){
			return browser.sleep(4500);
		});

		test.step("assert url is correct", function(){
			return expect(browser.getCurrentUrl()).toEqual('https://en.wikipedia.org/wiki/Colorado');
		});

		//compile results, then call jasmines (done) function to complete the test.
		test.finalize(function(){
			done();
		}.bind(this));
	});


	it("should have polish search support", function(done){
		browser.waitForAngularEnabled(false);//disable protractors default flow controll.  Wikipedia is not built with angular.
		var test = new IOC();//new up an IOC object.
		test.logger.level = "trace";


		test.step("load the test url: " + url, function(){
			return browser.get(url);
		});

		test.step("wait for the page to load successfully", function(){
			return browser.sleep(500);
		});

		test.step("click to open dropdown for language", function(){
			return element(by.xpath(language)).click();
		});

		test.step("click polish", function(){
			return element(by.xpath(polish)).click();
		});

		test.step("enter search term", function(){
			return element(by.xpath(searchText)).sendKeys(searchTerm);
		});

		test.step("click go", function(){
			return element(by.xpath(searchButton)).click();
		});

		test.step("wait for page to load", function(){
			return browser.sleep(4500);
		});

		test.step("assert url is correct", function(){
			return expect(browser.getCurrentUrl()).toEqual('https://en.wikipedia.org/wiki/Colorado');
		});

		//compile results, then call jasmines (done) function to complete the test.
		test.finalize(function(){
			done();
		}.bind(this));
	});
});