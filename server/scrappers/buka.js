var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var request = require("request");
var feedMethods = require("../components/feedMethods");
var domain = "http://www.shop.buka.ru";

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        var style = $("body").attr("style");
        var bg_url = style.replace(/(^.*url\(['"])(.*.jpg)(.*)/, "$2");
        var image_url =  bg_url ? bg_url : null;
        data.image = domain + image_url;

        data.description = [];
        $(".onenewsdiv p").each(function() {
            data.description.push($(this)[0].children[0].data);
        });

        cb(error, data);
    });
};

module.exports.feeds = function(provider) {
    var deferred = Q.defer();

    var url = "http://www.shop.buka.ru/newslist";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var selector = ".newstable .newslistdiv";
        var content = [];

        $(selector).each(function(index, elem) {
            var title = $(this).find(".newstableheader")[0].children[0].data;
            var image = domain + $(this).find(".newsimgdiv img").attr("src");
            var link = domain + $(this).find(".headpreviewcontent > a").attr("href");

            content.push({
                label: feedMethods.parseString(title),
                link: link,
                image: image
            });
        });


        var feed =  {
            label: "Buka",
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