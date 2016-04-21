var _ = require('lodash');

var scraper = {
    providers: {}
};
scraper.providers.onliner = require("./scrappers/onliner");
scraper.providers.habrahabr = require("./scrappers/habrahabr");
scraper.providers['tut.by'] = require("./scrappers/tut.by");
scraper.providers.stopgame = require("./scrappers/stopgame");

module.exports = scraper;