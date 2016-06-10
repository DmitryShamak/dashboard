var _conf = require("./_conf.js");

module.exports = {
    googleAuth: {
        //clientID: "26649791053-mci43bl8jv34b0iauosji3i41dla2vdv.apps.googleusercontent.com",
        clientID: "165068526392-gfjhu7kvr87c36foedpcahep40eudb6r.apps.googleusercontent.com",
        //clientSecret: "e2vkGogqs62AFvXU6bdwiK2P",
        clientSecret: "pmWBFYVMY8dxavdwlZCs_JL_",
        callbackURL: _conf.serverUrl + "/auth/google/callback"
    }
};