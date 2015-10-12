/*
   Class: CommunicationController
   The main controller of the plugin
*/
CommunicationExtension.CommunicationController = (function (){
    var that = {},

    /* 
        Variable: websocket
        Reference to the WebSocketController
    */
    websocket = null,

    /* 
        Variable: pageEventListener
        Reference to the PageEventListener
    */
    pageEventListener = null,

    /* 
        Variable: settings
        Reference to the settings
    */
    settings = null,

    /* 
        Variable: activated
        is the tab currently active or not
    */
    activated = true,


/* public methods */
    /* 
        Function: init
        Function which initialises the CommunicationController
    */
    init = function(){
        settings = CommunicationExtension.Settings;

        Logger.log('Communication controller init');

        websocket = CommunicationExtension.WebsocketController.init();

        $(websocket).on('messageReceived', onMessageReceived);

        //forward data to communication extension main class

        $(websocket).on('connectionClosed', CommunicationExtension.onConnectionClosed);

        $(websocket).on('connectionError', CommunicationExtension.onConnectionError);

        $(websocket).on('connectionComplete', CommunicationExtension.onConnectionComplete);

        pageEventListener = CommunicationExtension.PageEventListener.init();

        $(pageEventListener).on('event', onEventHappend);

        return that;
    },

    /* 
        Function: openWebsocket
        Opens the websocket connection with the values from the settings
    */
    openWebsocket = function(){
        if(settings.getUseCustomIP()){
            Logger.log('using custom IP');
            var ip = settings.getServerIP();
            var port = settings.getServerPort();

            websocket.openWebsocket(ip, port);
        }else{
            websocket.openWebsocket(settings.getDefaultIP(), settings.getDefaultPort());
        }
    },

    /* 
        Function: restartWebsocket
        Restarts the websocket connection
    */
    restartWebsocket = function(){
        closeWebsocket();
        openWebsocket();
    }

    /* 
        Function: buttonClick
        Gets called when a button was clicked (not used currently)
    */
    buttonClick = function(){
        websocket.sendTestJSON();
    },

    /* 
        Function: closeWebsocket
        Closes the websocket connection
    */
    closeWebsocket = function(){
        websocket.closeWebsocket();
    },

/* private methods */

    /* 
        Function: onMessageReceived
        Gets called from the WebsocketController when a message is received


        Parameters:
          object - The message object which was received
    */
    onMessageReceived = function(event, object){
        //Logger.log('messageObject', object);
        if(activated){
            processMessage(object);
        }
    },

    /* 
        Function: onEventHappend
        Gets called from the PageEventListener when an event happend

        Parameters:
          messageObj - The message object to be sent to the server
    */
    onEventHappend = function(event, messageObj){
        Logger.log('Event: ', messageObj);
        if(activated){
            websocket.sendJSON(messageObj);
        }
    },

    /*
        Function: processMessage
        Processes the message received over the websocket connection

        Parameters:
          object - The message object which needs to be processed
    */
    processMessage = function(object){
        // data request
        if(object.command == 'request'){
            var responseObject = CommunicationExtension.DataModel.init(object).exportForJSON();

            websocket.sendJSON(responseObject);
        }
    },

    /*
        Function: activateTab
        Called when the tab gets activated
    */
    activateTab = function(){
        activated = true;
        websocket.sentActivateTabMessage();
    },

    /*
        Function: deactivateTab
        Called when the tab gets deactivated
    */
    deactivateTab = function(){
        activated = false;
        websocket.sentDeactivateTabMessage();
    };

    that.init = init;
    that.openWebsocket = openWebsocket;
    that.restartWebsocket = restartWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.buttonClick = buttonClick;

    that.activateTab = activateTab;
    that.deactivateTab = deactivateTab;

    return that;
})();