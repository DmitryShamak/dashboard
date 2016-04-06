var cheerio = require("cheerio");
var request = require("request");
var _ = require('lodash');
var Q = require("q");

module.exports = function() {
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

        return {
            label: "Onliner",
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