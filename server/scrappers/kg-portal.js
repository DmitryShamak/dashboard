var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
var feedMethods = require("../components/feedMethods");
var domain = "http://kg-portal.ru";

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var content = $(".news_box");
        var data = {};

        var img_url = $(content).find(".news_text img").attr("src");
        data.image = img_url ? domain + img_url : null;
        data.description = [];

        $(content).find("p").each(function(ind, elem) {
            var text = $(elem).text();

            data.description.push(text);
        });

        cb(error, data);
    });
};

module.exports.feeds = function(provider) {
    var deferred = Q.defer();

    var url = "http://kg-portal.ru/news/all/";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var selector = ".ten_col2_content .news_box";
        var content = [];

        $(selector).each(function() {
            var title = $(this).find("h2")[0].children[0].data;

            var img_url  = $(this).find(".news_text img").attr("src");
            var image = null;
            if(img_url) {
                image = img_url.match(/http.*/) ? img_url : domain + img_url;
            }

            var link =  domain + $(this).find(">a").attr("href").replace(/\/$/, "");
            var date = $(this).find(".date").attr("content");

            content.push({
                label: title,
                link: link,
                image: image,
                date: new Date(date)
            });
        });


        var feed =  {
            label: "KG-Portal",
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