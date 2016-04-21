var _conf = require("./_conf.js");

module.exports = {
    googleAuth: {
        clientID: "26649791053-mci43bl8jv34b0iauosji3i41dla2vdv.apps.googleusercontent.com",
        clientSecret: "e2vkGogqs62AFvXU6bdwiK2P",
        callbackURL: _conf.serverUrl + "/auth/google/callback"
    }
};