angular.module("app")
    .factory("websocket", function() {
        function Socket(scope) {
            var self = this;

            self.socket = new WebSocket("ws://" + window.location.host);

            self.socket.onopen = function() {
                //console.info("Соединение установлено.");
            };

            self.socket.onclose = function(event) {
                /*if (event.wasClean) {
                    console.info('Соединение закрыто чисто');
                } else {
                    console.info('Обрыв соединения'); // например, "убит" процесс сервера
                }
                console.info('Код: ' + event.code + ' причина: ' + event.reason);*/
            };

            self.socket.onmessage = function(message) {
                var parse = JSON.parse(message.data);

                if(scope && parse.flag === "update") {
                    scope.canRefresh = true;
                    scope.apply(scope);
                }

                //console.info("Получены данные " + parse.text);
            };

            self.socket.onerror = function(error) {
                //console.info("Ошибка " + error.message);
            };
        }

        return {
            init: function(scope) {
                return new Socket(scope);
            }
        };
    });