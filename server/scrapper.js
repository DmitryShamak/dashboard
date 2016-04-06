
var _ = require('lodash');

var scrapers = {};
scrapers.onliner = require("./scrappers/onliner");
scrapers.habrahabr = require("./scrappers/habrahabr");

module.exports = scrapers;