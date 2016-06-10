var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
var xml2js = require('xml2js');

var feedMethods = require("../components/feedMethods");

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        data.image = $(".b-posts-1-item__image img").attr("src");
        data.description = [];
        $(".b-posts-1-item__text p").each(function(index, element) {
            $(element).children().remove();
            var text = ($(element).text() || "").trim();

            if(text) {
                data.description.push(text);
            }
        });

        cb(error, data);
    });
};

module.exports.feeds = function(provider) {
    var deferred = Q.defer();

    var urls = ["http://tech.onliner.by/feed", "https://auto.onliner.by/feed", "https://realt.onliner.by/feed"];

    var parser = function(query, xmls) {
        var parseString = xml2js.parseString;
        var content = [];

        if(!_.isArray(xmls)) {
            xmls = [xmls];
        }

        _.forEach(xmls, function(xml) {
            parseString(xml, function (err, result) {
                var json = result;

                var list = json.rss.channel[0].item.map(function(item) {
                    return {
                        label: item.title[0].replace("&nbsp;", " "),
                        image: item['media:thumbnail'][0].$.url,
                        link: item.link[0].replace(/\/$/, ""),
                        date: new Date(item.pubDate)
                    };
                });

                content = content.concat(list);
            });
        });

        var feed = {
            label: "Onliner",
            provider: provider,
            content: content,
            totalCount: content.length
        };

        return Q.promise(function(res, rej) {
            res(feed);
        });
    };

    feedMethods.callback(urls, parser, deferred);

    return deferred.promise;
};