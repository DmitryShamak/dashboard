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

    var url = "http://tech.onliner.by/feed";

    var parser = function(query, xml) {
        var parseString = xml2js.parseString;
        var content = [];

        parseString(xml, function (err, result) {
            var json = result;

            content = json.rss.channel[0].item.map(function(item) {
                return {
                    label: item.title[0],
                    image: item['media:thumbnail'][0].$.url,
                    link: item.link[0].replace(/\/$/, "")
                };
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

    feedMethods.callback(url, parser, deferred);

    return deferred.promise;
};