var _ = require('lodash');

var scraper = {
    providers: {}
};
scraper.providers.onliner = require("./scrappers/onliner");
scraper.providers['tut.by'] = require("./scrappers/tut.by");
scraper.providers.belaruspartisan = require("./scrappers/belaruspartisan");
////
scraper.providers.habrahabr = require("./scrappers/habrahabr");
////////scraper.providers["eax.me"] = require("./scrappers/eax.me");


scraper.providers.adme = require("./scrappers/adme");

scraper.providers.stopgame = require("./scrappers/stopgame");
scraper.providers["4game"] = require("./scrappers/4game");
////scraper.providers.gog = require("./scrappers/gog");
scraper.providers.buka = require("./scrappers/buka");
////
////scraper.providers.oz = require("./scrappers/oz");
////
scraper.providers["kg-portal"] = require("./scrappers/kg-portal");

module.exports = scraper;