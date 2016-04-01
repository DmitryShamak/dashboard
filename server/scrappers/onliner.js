var cheerio = require("cheerio");
var request = require("request");
var _ = require('lodash');

module.exports = function(callback) {
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
            })
        });
        return {
            title: "",
            content: content,
            totalCount: content.length
        };
    };

    request({
        uri: url
    }, function(error, response, body) {
        var data = parser(query, body);
        var totalCount = 0;
        _.forEach(data.list, function(value, key) {
            totalCount += value.totalCount || 0;
        });
        data.totalCount = totalCount;

        callback(null, data);
    });
};