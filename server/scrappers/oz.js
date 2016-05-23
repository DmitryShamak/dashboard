var cheerio = require("cheerio");
var _ = require('lodash');
var Q = require("q");
var feedMethods = require("../components/feedMethods");

module.exports.find = function(props, cb) {
    request({
        uri: props.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);
        var data = {};

        //data.image;
        //data.description;

        cb(error, data);
    });
};

module.exports.feeds = function(userId, provider) {
    var deferred = Q.defer();

    var url = "address to web page";
    var parser = function(query, body) {
        var $ = cheerio.load(body);
        var selector = "";
        var content = [];

        $(selector).each(function() {
            //$(this).find(element)
            var title = "";
            var image = "";
            var link = "";
            var description = "";

            content.push({
                label: title,
                link: link,
                image: image,
                description: description
            });
        });


        var feed =  {
            label: "BLANK",
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