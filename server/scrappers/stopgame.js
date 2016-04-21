var cheerio = require("cheerio");
var moment = require("moment");
var Q = require("q");
var request = require("request");
var feedMethods = require("../components/feedMethods");

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        var container = $(".main_text");
        data.image = $(".main_text img, .game-image img").attr("src");

        data.description = [];
        container.find("div, style").remove();
        var text = (container.text() || "").trim();

        if(text) {
            data.description.push(text);
        }

        cb(error, data);
    });
};

module.exports.feeds = function(provider) {
    var deferred = Q.defer();
    var date = moment().format("MM/YYYY"); //04/2016

    var url = "http://stopgame.ru/news";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var content = [];

        $(".news-lent").each(function() {
            var title = $(this).find(".lent-title a").text().trim();
            var image = $(this).find(".lent-image img").attr("src");
            var link = "http://stopgame.ru" + $(this).find(".lent-title a").attr("href");

            var dateParts = $(this).find(".lent-date").text().split(".");
            var date = moment().year(dateParts[2]).month(dateParts[1]-1).date(dateParts[0]).toDate();

            content.push({
                label: title,
                link: link,
                image: image,
                date: moment(date).toDate()
            });
        });

        var feed =  {
            label: "Stopgame",
            provider: provider,
            content: content
        };

        return Q.promise(function(res, rej) {
            res(feed);
        });
    };

    feedMethods.callback(url, parser, deferred);

    return deferred.promise;
};