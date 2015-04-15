CommunicationExtension.WebsocketController = (function (){
    var that = {},
    connection = null,


/* public methods */

    init = function(){
        Logger.log('websocket controller init');

        return that;
    },

    openWebsocket = function(ip, port, secure){
        if(secure == undefined){
            if (window.location.protocol != "https:"){
                secure = false;
            }else{
                secure = true;
            }
        }

        if(secure){
            Logger.log('secure websocket');
            openWebsocketReal('wss://'+ip+':'+port+'/');
        }else{
            Logger.log('unsecure websocket');
            openWebsocketReal('ws://'+ip+':'+port+'/');
        }
    },

    closeWebsocket = function(){
        connection.close();
    },

    sendJSON = function(object){
        object.clientsent = Timestamp.getMillisecondsTimestamp();

        var json = JSON.stringify(object);
        connection.send(json);
    },

    sendTestJSON = function(){
        Logger.log('sending test json');
        var obj = new Object();
        obj.command = "request";
        obj.x = 16;
        obj.y = 15;

        sendJSON(obj);
        Logger.log('test json sent!');
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
        Logger.log('Socket open');

        sendConnectionRequest();
    },

    onError = function(e){
        Logger.error('WebSocket Error: ' + e);
    },

    onMessage = function(e){
        var timestamp = Timestamp.getMillisecondsTimestamp();
        Logger.log('Server: ' + e.data);

        var object = $.parseJSON(e.data);

        object.clientreceived = timestamp;

        if(object != undefined && object.command != undefined){
            if(object.command == "connectionResponse")
            {
                sendConnectionComplete();
            }else{
                $(that).trigger('messageReceived', object);   
            }
        }
    },

    onClose = function(e){
        Logger.log('Server close: ' + e);
    },

    sendConnectionRequest = function(){
        Logger.log('sending connection request');
        var object = new Object();
        object.command = "connectRequest";
        object.page = window.location.href;

        sendJSON(object);
    },

    sendConnectionComplete = function(){
        Logger.log('sending connection ');
        var object = new Object();
        object.command = "connectComplete";
        object.page = window.location.href;

        sendJSON(object);
    };

    that.init = init;

    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.sendJSON = sendJSON;

    that.sendTestJSON = sendTestJSON;

    return that;
})();