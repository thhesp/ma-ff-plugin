console.log('load?');

console.log('vor websocket');

var connection = new WebSocket('ws://localhost:8888/ws');

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

console.log('finished');

self.port.on("click", sendMessage);

function sendMessage() {
  connection.send('Click happend?');
}