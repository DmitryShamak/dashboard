var WebSocketServer = require('ws').Server;

module.exports = function(server) {
    var wss = new WebSocketServer({ server: server });

    wss.broadcast = function(message) {
        for (var i in this.clients) {
            this.clients[i].send(JSON.stringify(message));
        }
    };

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            var parse = JSON.parse(message);
            if(parse.flag && parse.flag === "update") {
                console.info("receive update");
                wss.broadcast(parse);
            } else {
                console.log('received: %s', parse.text, parse.flag);
            }
        });
    });

    return wss;
};

