CommunicationExtension.CommunicationController = (function (){
    var that = {},
    websocket = null,

    defaultIP = 'localhost',
    defaultPort = '8888',

    activated = false,


/* public methods */

    init = function(){
        console.log('Communication controller init');

        websocket = CommunicationExtension.WebsocketController.init();

        $(websocket).on('messageReceived', onMessageReceived);

        return that;
    },

    openWebsocket = function(extensionSettings){
        var useCustomIP = extensionSettings['useCustomIP'];

        if(useCustomIP){
            console.log('using custom IP');
            var ip = extensionSettings['serverIP'];
            var port = extensionSettings['serverPort'];

            websocket.openWebsocket(ip, port);
        }else{
             websocket.openWebsocket(defaultIP, defaultPort);
        }
    },

    restartWebsocket = function(extensionSettings){
        closeWebsocket();
        openWebsocket(extensionSettings);
    }

    buttonClick = function(){
        websocket.sendTestJSON();
    },

    closeWebsocket = function(){
        websocket.closeWebsocket();
    },

/* private methods */

    onMessageReceived = function(event, object){
        console.log('messageObject', object);
        if(activated){
            processMessage(object);     
        }
    },

    processMessage = function(object){
        if(object.command == 'request'){
            var responseObject = CommunicationExtension.DataModel.init(object).exportForJSON();

            websocket.sendJSON(responseObject);
        }
    },

    activateTab = function(){
        activated = true;
    },

    deactivateTab = function(){
        activated = false;
    };

    that.init = init;
    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.buttonClick = buttonClick;

    that.activateTab = activateTab;
    that.deactivateTab = deactivateTab;

    return that;
})();