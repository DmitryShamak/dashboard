var _ = require("lodash");

var tags = {
    "welcome": {
        title: "welcome",
        text: "thank you for joining us"
    }
};

var generator = function(user, tag) {
    var notification = {
        user: user._id
    };

    _.forEach(tags[tag], function(value, key) {
        notification[key] = (value.trim()).replace(/\s/g, "_");
    });

    return notification;
};

module.exports = generator;