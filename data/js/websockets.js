console.log('load?');

console.log('vor websocket');

var connection = null;

function restartWebsocketClient(settings){
    closeWebsocket(settings);
    openWebsocket();
}

function openWebsocket(settings){
    var useCustomIP = settings['useCustomIP'];

    if(useCustomIP){
        console.log('using custom IP');
        var ip = settings['serverIP'];
        var port = settings['serverPort'];

        connection = new WebSocket('ws://'+ip+':'+port+'/');
    }else{
        //connection = new WebSocket('ws://localhost:8888/ws');

        connection = new WebSocket('ws://192.168.111.140:8888/');
    }

    console.log('nach websocket');

    connection.onopen = function () {
        connection.send('Ping'); // Send the message 'Ping' to the server
    };

        // Log errors
    connection.onerror = function (error) {
        console.log('WebSocket Error: ' + error);
    };

        // Log messages from the server
    connection.onmessage = function (e) {
        console.log('Server: ' + e.data);
    };

            // Log close
    connection.onclose = function (e) {
        console.log('Server close: ' + e);
    };

    console.log(connection);

    return connection;
}

function closeWebsocket(){
    connection.close();
}


function sendMessage(message) {
  connection.send('Click happend? '+message);
}

console.log('finished');

console.log('jquery test');

console.log($('body'));

console.log('ende jquery test');

self.port.on("click", sendMessage);
self.port.on("restart", restartWebsocketClient);
self.port.on("open", openWebsocket);
self.port.on("close", closeWebsocket);
