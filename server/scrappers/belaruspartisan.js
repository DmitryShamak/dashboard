var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
var xml2js = require('xml2js');
var domain = "http://www.belaruspartisan.org";

var feedMethods = require("../components/feedMethods");

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        var image = $(".wrap_detail_image .detail_picture");

        if(image.length) {
            data.image = domain + image.attr("src");
        } else {
            data.image = domain + $("#header img").attr("src");
        }

        data.description = [];
        $(".detail_text").each(function(index, element) {
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

    var url = "http://www.belaruspartisan.org/rss/all";

    var parser = function(query, xml) {
        var parseString = xml2js.parseString;
        var content = [];

        parseString(xml, function (err, result) {
            var json = result;

            var imageUrl = json.rss.channel[0].image[0].url[0];

            content = json.rss.channel[0].item.map(function(item) {
                return {
                    label: item.title[0],
                    image: imageUrl,
                    link: item.link[0],
                    date: new Date(item.pubDate)
                };
            });
        });

        var feed = {
            label: "Belarus Partisan",
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