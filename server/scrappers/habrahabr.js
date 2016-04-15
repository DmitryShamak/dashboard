var cheerio = require("cheerio");
var _ = require('lodash');
var request = require("request");
var Q = require("q");
var feedMethods = require("../components/feedMethods");

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        var linkImage = $(".content.html_format a > div > img");
        var firstImage = $(".content.html_format img")[0];
        data.image = linkImage.length ? linkImage.attr("src") : $(firstImage).attr("src");

        data.description = [];
        var description = $(".content.html_format");
        description.find("img, br, iframe, script").remove();
        var text = (description.text() || "").trim();

        if(text) {
            data.description.push(text);
        }

        cb(error, data);
    });
};

module.exports.feeds = function(userId, provider) {
    var deferred = Q.defer();

    var url = "https://habrahabr.ru/";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var content = [];

        $(".posts.shortcuts_items .shortcuts_item").each(function(elem) {

            var title = $(this).find(".post_title").text().trim();

            var linkImage = $(this).find(".content.html_format a > div > img");
            var firstImage = $(this).find(".content.html_format img")[0];
            var image = linkImage.length ? linkImage.attr("src") : $(firstImage).attr("src");

            var link = $(this).find("a.post_title").attr("href");
            var textBlock = $(".content.html_format");
            textBlock.find("div").remove();
            var text = textBlock.text().trim();
            //var date = $(this).find("time").attr("datetime");

            if(!title || !link) {
                return;
            }

            content.push({
                label: title,
                link: link,
                image: image,
                description: text
            });
        });

        var feed = {
            label: "Habrahabr",
            provider: provider,
            totalCount: content.length
        };

        return feedMethods.compareContent(userId, feed, content);
    };

    feedMethods.callback(url, parser, deferred);

    return deferred.promise;
};