CommunicationExtension.CommunicationController = (function (){
    var that = {},
    websocket = null,

    pageEventListener = null,

    settings = null,

    activated = true,


/* public methods */

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

    restartWebsocket = function(){
        closeWebsocket();
        openWebsocket();
    }

    buttonClick = function(){
        websocket.sendTestJSON();
    },

    closeWebsocket = function(){
        websocket.closeWebsocket();
    },

/* private methods */

    onMessageReceived = function(event, object){
        Logger.log('messageObject', object);
        if(activated){
            processMessage(object);
        }
    },

    onEventHappend = function(event, messageObj){
        Logger.log('Event: ' + messageObj);
        if(activated){
            //websocket.sendJSON(messageObj);
        }
    },

    processMessage = function(object){
        // data request
        if(object.command == 'request'){
            var responseObject = CommunicationExtension.DataModel.init(object).exportForJSON();

            websocket.sendJSON(responseObject);
        }
    },

    activateTab = function(){
        activated = true;
        websocket.sentActivateTabMessage();
    },

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