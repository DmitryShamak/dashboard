var _conf = require("./_conf.js");

module.exports = {
    googleAuth: {
        clientID: "907084589258-pjkjvffoceboubhhvulgthh9vj4n209a.apps.googleusercontent.com",
        clientSecret: "iaKzdCo5exkHvBzlJBbgks0a",
        callbackURL: _conf.serverUrl + "/auth/google/callback"
    }
};