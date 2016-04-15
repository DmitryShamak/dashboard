var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
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

module.exports.feeds = function(userId, provider) {
    var deferred = Q.defer();

    var url = "http://tech.onliner.by/";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var content = [];

        $(".g-middle .b-posts-1-item").each(function(elem) {
            var title = $(this).find("h3").text().trim();
            var image = $(this).find("img").attr("src");
            var textBlock = $(this).find("p");
            var link = textBlock.find("a:last-of-type").attr("href");
            textBlock.find("a").remove();
            var text = textBlock.text().trim();
            var date = $(this).find("time").attr("datetime");

            content.push({
                label: title,
                link: link,
                image: image,
                description: text,
                date: date
            });
        });


        var feed = {
            label: "Onliner",
            provider: provider,
            totalCount: content.length
        };

        return feedMethods.compareContent(userId, feed, content);
    };

    feedMethods.callback(url, parser, deferred);

    return deferred.promise;
};