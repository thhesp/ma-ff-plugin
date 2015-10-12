/*
   Class: WebsocketController
   The controller for the websocket connection
*/
CommunicationExtension.WebsocketController = (function (){
    var that = {},

    /*
       Constants: Ready States of the websocket

       READY_STATE_CONNECTING - The websocket is opening the connection
       READY_STATE_OPEN   - The connection is open
       READY_STATE_CLOSING   - The connection is closing
       READY_STATE_CLOSED - The connection is closed.
    */
    READY_STATE_CONNECTING = 0,
    READY_STATE_OPEN = 1,
    READY_STATE_CLOSING = 2,
    READY_STATE_CLOSED = 3,

    /* 
        Variable: connection
        The websocket connection
    */
    connection = null,

    /* 
        Variable: opening
        Is the websocket currently trying to open the connection
    */
    opening = false,

    /* 
        Variable: lastConnectionString
        The last settings used for connecting
    */
    lastConnectionString = null,

    /* 
        Variable: retries
        The number of times the websocket tried to connect to the server
    */
    retries = 0,

    /* 
        Constant: maxRetries
        The maximum number of retries
    */
    maxRetries = 5,

/* public methods */


    /* 
        Function: init
        Function which initialises the WebsocketController
    */
    init = function(){
        Logger.log('websocket controller init');
        retries = 0;
        opening = false;
        open = false;

        lastConnectionString = null;

        //close connection when closing the window
        $(window).on('beforeunload', function(){
            if(connection != undefined){
                Logger.log("closing the connection, because the page is closing");
                connection.close();
            }
        });

        return that;
    },

    /* 
        Function: openWebsocket
        Opens the websocket connection


        Parameters:

          ip - Server IP
          port - Server Port
          secure - Open a secure connection

    */
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

    /* 
        Function: closeWebsocket
        Closes the websocket connection
    */
    closeWebsocket = function(){
        connection.close();
    },

    /* 
        Function: sendJSON
        Sends the object as JSON


        Parameters:

          object - Object to be sent as json
          small - If true only sends the object and adds no extra data to it
    */
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

    /* 
        Function: openWebsocketReal
        Internally opens the websocket connection


        Parameters:

          connectionString - String which is necessary to open the connection

    */
    openWebsocketReal = function(connectionString){
        //opening process starting
        opening = true;
        lastConnectionString = connectionString;

        connection = new WebSocket(connectionString);

        setWebSocketListener();
    },

    /* 
        Function: setWebSocketListener
        Sets listeners on the websocket connection
    */
    setWebSocketListener = function(){
        connection.onopen = onOpen;

        // Log errors
        connection.onerror = onError;

        // Log messages from the server
        connection.onmessage = onMessage;

        // Log close
        connection.onclose = onClose;
    },

    /* 
        Function: onOpen
        Gets called when the websocket connection opens


        Parameters:

          e - Eventdata for the websocket open event
    */
    onOpen = function(e){
        Logger.log('Socket open', e);

        Logger.log("Status: ", connection.readyState);
        //opening successful
        opening = false;
        retries = 0;

        sendConnectionRequest();
    },

    /* 
        Function: onError
        Gets called when an error happens with the websocket connection


        Parameters:

          e - data about the event

    */
    onError = function(e){
        Logger.error('WebSocket Error', e);
        $(that).trigger('connectionError');

        // if the error happend while opening, retry connection
        if(opening){
            retryConnection();
        }
    },

    /* 
        Function: onMessage
        Gets called when a message is received on the connection


        Parameters:

          e - eventdata (message is in e.data)

    */
    onMessage = function(e){
        var timestamp = Timestamp.getMillisecondsTimestamp();
        //Logger.log('Server: ', e.data);

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

    /* 
        Function: onClose
        Gets called when the websocket closes


        Parameters:

          e- Data about the close event

    */
    onClose = function(e){
        Logger.log('Server close', e);
        $(that).trigger('connectionClosed');
    },

    /* 
        Function: sendConnectionRequest
        Sents a connection request to the server
    */
    sendConnectionRequest = function(){
        Logger.log('sending connection request');
        var object = new Object();
        object.command = "connectRequest";

        sendJSON(object, true);
    },

    /* 
        Function: sendConnectionComplete
        Sends the connection complete to the server
    */
    sendConnectionComplete = function(){
        $(that).trigger('connectionComplete');
        Logger.log('sending connection complete');
        var object = new Object();
        object.command = "connectComplete";
        object.url = window.location.href;

        object.height = window.innerHeight;
        object.width = window.innerWidth;

        sendJSON(object, true);
    },

    /* 
        Function: retryConnection
        Retries to establish the connection after it failed
    */
    retryConnection = function(){
        if(retries < maxRetries){
            Logger.log("retrieing connection...");
            retries++;
            openWebsocketReal(lastConnectionString);
        }else{
            Logger.error("No Websocket could be opened");
        }
    },

    /* 
        Function: sentActivateTabMessage
        Sents a message that the tab was activated
    */
    sentActivateTabMessage = function(){
        console.log("sent activate tab message");
        var object = new Object();
        object.command = "activate";
        object.url = window.location.href;

        object.height = window.innerHeight;
        object.width = window.innerWidth;

        sendJSON(object, true);
    },

    /* 
        Function: sentDeactivateTabMessage
        Sents a message that the tab was deactivated
    */
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