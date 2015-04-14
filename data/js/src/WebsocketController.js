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
            if (window.location.protocol != "https:"){
                secure = false;
            }else{
                secure = true;
            }
        }

        if(secure){
            console.log('secure websocket');
            openWebsocketReal('wss://'+ip+':'+port+'/');
        }else{
            console.log('unsecure websocket');
            openWebsocketReal('ws://'+ip+':'+port+'/');
        }
    },

    closeWebsocket = function(){
        connection.close();
    },

    sendJSON = function(object){
        object.timestamp = getUnixTimestamp();

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

        sendConnectionRequest();
    },

    onError = function(e){
        console.log('WebSocket Error: ' + e);
    },

    onMessage = function(e){
        console.log('Server: ' + e.data);

        var object = $.parseJSON(e.data);

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
        console.log('Server close: ' + e);
    },

    sendConnectionRequest = function(){
        console.log('sending connection request');
        var object = new Object();
        object.command = "connectRequest";
        object.page = window.location.href;

        sendJSON(object);
    },

    sendConnectionComplete = function(){
        console.log('sending connection ');
        var object = new Object();
        object.command = "connectComplete";
        object.page = window.location.href;

        sendJSON(object);
    },

    getUnixTimestamp = function(){
        return Math.round((new Date()).getTime() / 1000);
    };

    that.init = init;

    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.sendJSON = sendJSON;

    that.sendTestJSON = sendTestJSON;

    return that;
})();