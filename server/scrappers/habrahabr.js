var cheerio = require("cheerio");
var request = require("request");
var _ = require('lodash');
var Q = require("q");

module.exports = function() {
    var deferred = Q.defer();

    var url = "https://habrahabr.ru/";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var content = [];

        $(".posts.shortcuts_items .shortcuts_item").each(function(elem) {

            var title = $(this).find(".post_title").text().trim();
            var image = $(this).find(".content.html_format img").attr("src");
            var link = $(this).find("a.post_title").attr("href");
            var textBlock = $(".content.html_format");
            textBlock.find("div").remove();
            var text = textBlock.text().trim();
            //var date = $(this).find("time").attr("datetime");

            content.push({
                label: title,
                link: link,
                image: image,
                description: text
            });
        });

        return {
            label: "Habrahabr",
            content: content,
            totalCount: content.length
        };
    };

    request({
        uri: url
    }, function(error, response, body) {
        var query = {};
        var data = parser(query, body);

        deferred.resolve(data);
    });

    return deferred.promise;
};