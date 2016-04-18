var cheerio = require("cheerio");
var moment = require("moment");
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

        data.image = $(".main_image").attr("src");
        data.description = [];
        var description = $("#event-description");
        description.find("br, iframe, script, .note, .b-prmplace-media").remove();
        var text = (description.text() || "").trim();

        if(text) {
            data.description.push(text);
        }

        cb(error, data);
    });
};

module.exports.feeds = function(provider) {
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

        var feed =  {
            label: "TUT.BY",
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