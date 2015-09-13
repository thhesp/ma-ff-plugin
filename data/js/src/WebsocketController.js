CommunicationExtension.WebsocketController = (function (){
    var that = {},

    READY_STATE_CONNECTING = 0,
    READY_STATE_OPEN = 1,
    READY_STATE_CLOSING = 2,
    READY_STATE_CLOSED = 3,

    connection = null,

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


        if(connection != undefined && 
            connection.readyState == READY_STATE_OPEN){
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
        Logger.log('Socket open', e);

        Logger.log("Status: ", connection.readyState);
        //opening successful
        opening = false;
        retries = 0;

        sendConnectionRequest();
    },

    onError = function(e){
        Logger.error('WebSocket Error', e);
        $(that).trigger('connectionError');

        // if the error happend while opening, retry connection
        if(opening){
            retryConnection();
        }
    },

    onMessage = function(e){
        var timestamp = Timestamp.getMillisecondsTimestamp();
        Logger.log('Server: ', e.data);

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
        Logger.log('Server close', e);
        $(that).trigger('connectionClosed');
    },

    sendConnectionRequest = function(){
        Logger.log('sending connection request');
        var object = new Object();
        object.command = "connectRequest";

        sendJSON(object, true);
    },

    sendConnectionComplete = function(){
        $(that).trigger('connectionComplete');
        Logger.log('sending connection complete');
        var object = new Object();
        object.command = "connectComplete";
        object.url = window.location.href;

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
    },

    sentActivateTabMessage = function(){
        console.log("sent activate tab message");
        var object = new Object();
        object.command = "activate";
        object.url = window.location.href;

        sendJSON(object, true);
    },

    sentDeactivateTabMessage = function(){
        console.log("sent deactivate tab message");
        var object = new Object();
        object.command = "deactivate";

        sendJSON(object, true);
    };

    that.init = init;

    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.sendJSON = sendJSON;
    that.sentActivateTabMessage = sentActivateTabMessage;
    that.sentDeactivateTabMessage = sentDeactivateTabMessage;

    return that;
})();