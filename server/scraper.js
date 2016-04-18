var _ = require('lodash');

var scraper = {
    providers: {}
};
scraper.providers.onliner = require("./scrappers/onliner");
scraper.providers.habrahabr = require("./scrappers/habrahabr");
scraper.providers['tut.by'] = require("./scrappers/tut.by");

module.exports = scraper;