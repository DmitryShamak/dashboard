var cheerio = require("cheerio");
var moment = require("moment");
var request = require("request");
var _ = require('lodash');
var Q = require("q");

module.exports = function() {
    var deferred = Q.defer();
    var date = moment().format("YYYY/MM/DD"); //2016/04/06

    var url = "http://afisha.tut.by/day/" + date;
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var content = [];

        $("ul.b-lists.list_afisha .lists__li").each(function(elem) {

            var title = $(this).find(".name span").text().trim();
            var image = $(this).find(".media img").attr("src");
            var link = $(this).find("a.media").attr("href");
            var text = $(this).find(".txt p").text().trim();

            content.push({
                label: title,
                link: link,
                image: image,
                description: text
            });
        });

        return {
            label: "TUT.BY",
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