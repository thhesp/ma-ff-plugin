CommunicationExtension.WebsocketController = (function (){
    var that = {},
    connection = null,

    open = false,

    opening = false,
    lastConnectionString = null,

    retries = 0,
    maxRetries = 5,

/* public methods */

    init = function(){
        Logger.log('websocket controller init');
        retries = 0;
        opening = false;
        open = false;

        lastConnectionString = null;

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
            //currenty secure websockets are not supported by the server
            //openWebsocketReal('wss://'+ip+':'+port+'/');

            openWebsocketReal('ws://'+ip+':'+port+'/');
        }else{
            Logger.log('unsecure websocket');
            openWebsocketReal('ws://'+ip+':'+port+'/');
        }
    },

    closeWebsocket = function(){
        connection.close();
    },

    sendJSON = function(object, small){


        if(open){
            if(small == undefined || small == false){
                object.clientsent = Timestamp.getMillisecondsTimestamp();
                object.url = window.location.href;

                var json = JSON.stringify(object);
                connection.send(json);
            }else{
                var json = JSON.stringify(object);
                connection.send(json);
            }
        }else{
            Logger.error("No open Websocket connection");
            retryConnection();
        }

    },

/* private methods */

    openWebsocketReal = function(connectionString){
        //opening process starting
        opening = true;
        lastConnectionString = connectionString;

        connection = new WebSocket(connectionString);

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
        open = true;

        //opening successful
        opening = false;
        retries = 0;

        sendConnectionRequest();
    },

    onError = function(e){
        Logger.error('WebSocket Error: ' + e);

        // if the error happend while opening, retry connection
        if(opening){
            retryConnection();
        }
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
        open = false;
        Logger.log('Server close: ' + e);
    },

    sendConnectionRequest = function(){
        Logger.log('sending connection request');
        var object = new Object();
        object.command = "connectRequest";

        sendJSON(object, true);
    },

    sendConnectionComplete = function(){
        Logger.log('sending connection complete');
        var object = new Object();
        object.command = "connectComplete";

        sendJSON(object, true);
    },

    retryConnection = function(){
        if(retries < maxRetries){
            Logger.log("retrieing connection...");
            retries++;
            openWebsocketReal(lastConnectionString);
        }else{
            Logger.error("No Websocket could be opened");
        }
    };

    that.init = init;

    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.sendJSON = sendJSON;

    return that;
})();