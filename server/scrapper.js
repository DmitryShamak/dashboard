
var _ = require('lodash');

var scrapers = {};
scrapers.onliner = require("./scrappers/onliner");
scrapers.habrahabr = require("./scrappers/habrahabr");
scrapers.tutby = require("./scrappers/tut.by");

module.exports = scrapers;