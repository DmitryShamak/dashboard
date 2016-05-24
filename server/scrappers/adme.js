var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
var xml2js = require('xml2js');
var domain = "http://www.adme.ru";

var feedMethods = require("../components/feedMethods");

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        data.image = $(".article-pic img").attr("src");
        data.description = [];
        $(".article.js-article-content .article__share_descr").remove();
        $(".article.js-article-content p").each(function(index, element) {
            if(index == 4) {
                return data.description.push("Больше информации на странице источника..");
            }
            if(index > 4) {
                return
            }

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

    var url = "http://www.adme.ru/rss/";

    var parser = function(query, xml) {
        var parseString = xml2js.parseString;
        var content = [];

        parseString(xml, function (err, result) {
            var json = result;

            content = json.rss.channel[0].item.map(function(item) {
                return {
                    label: item.title[0],
                    image: item['media:thumbnail'][0].$.url,
                    link: item.link[0],
                    date: new Date(item.pubDate)
                };
            });
        });

        var feed = {
            label: "AdMe",
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