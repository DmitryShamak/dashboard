var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
var feedMethods = require("../components/feedMethods");
var domain = "https://ru.4game.com/4gamer/";

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        var bg_url = $(".Article__cover.js-lazyCover").attr('data-cover');
        var image_url =  bg_url ? bg_url.replace(/(^url\(['"]?)(.*)(\)$)/, "$2") : null;
        if(image_url) {
            data.image = domain + image_url;
        }
        data.description = [];

        $(".Article__content p").each(function() {
            var p = $(this).text();
            if(p) {
                data.description.push(p.trim());
            }
        });

        cb(error, data);
    });
};

module.exports.feeds = function(provider) {
    var deferred = Q.defer();

    var url = domain;
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var container = $(".NewsGrid")[1];
        var selector = ".NewsGrid__content .js-Article-link";
        var content = [];

        $(container).find(selector).each(function() {
            //$(this).find(element)
            var title = $(this).find(".GridTile__title-text")[0].children[0].data;
            var bg_url = this.attribs['data-cover'];
            var image_url =  bg_url ? (bg_url.replace(/(^url\(['"]?)(.*)(\)$)/, "$2")) : null;
            var image = null;
            if(image_url) {
                image = domain + image_url;
            }
            var link = domain + ($(this).find('a.GridTile__link').attr('href').replace(/\/$/, ""));

            content.push({
                label: title,
                link: link,
                image: image
            });
        });


        var feed =  {
            label: "4Game",
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