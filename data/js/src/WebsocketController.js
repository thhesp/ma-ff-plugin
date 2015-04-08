CommunicationExtension.WebsocketController = (function (){
    var that = {},
    connection = null,


/* public methods */

    init = function(){
        console.log('websocket controller init');

        return that;
    },

    openWebsocket = function(ip, port, secure){
        if(secure == undefined){
            secure = false;
        }

        if(secure){
            openWebsocketReal('wss://'+ip+':'+port+'/');
        }else{
            openWebsocketReal('ws://'+ip+':'+port+'/');
        }
    },

    closeWebsocket = function(){
        connection.close();
    },

    sendJSON = function(object){
        var json = JSON.stringify(object);
        connection.send(json);
    },

    sendTestJSON = function(){
        console.log('sending test json');
        var obj = new Object();
        obj.command = "request";
        obj.x = 16;
        obj.y = 15;

        sendJSON(obj);
        console.log('test json sent!');
    },

/* private methods */

    openWebsocketReal = function(fullstring){
        connection = new WebSocket(fullstring);

        setWebSocketListener();
    },

    setWebSocketListener = function(){
        connection.onopen = onOpen;

        // Log errors
        connection.onerror = onError;

        // Log messages from the server
        connection.onmessage = onMessage;

        // Log close
        connection.onclose = onClose;
    },

    onOpen = function(e){
        console.log('Socket open');

        sendOpenSequence();
    },

    onError = function(e){
        console.log('WebSocket Error: ' + e);
    },

    onMessage = function(e){
        console.log('Server: ' + e.data);

        var object = $.parseJSON(e.data);

        if(object != undefined && object.command != undefined){
            $(that).trigger('messageReceived', object);
        }
    },

    onClose = function(e){
        console.log('Server close: ' + e);
    },

    sendOpenSequence = function(){
        console.log('sending test json');
        var object = new Object();
        object.command = "connect";
        object.page = window.location.href;

        sendJSON(object);
        console.log('test json sent!');

    };

    that.init = init;

    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.sendJSON = sendJSON;

    that.sendTestJSON = sendTestJSON;

    return that;
})();