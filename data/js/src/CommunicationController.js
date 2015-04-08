CommunicationExtension.CommunicationController = (function (){
    var that = {},
    websocket = null,

    defaultIP = 'localhost',
    defaultPort = '8888',


/* public methods */

    init = function(){
        console.log('Communication controller init');

        websocket = CommunicationExtension.WebsocketController.init();

        $(websocket).on('messageReceived', onMessageReceived);

        return that;
    },

    openWebsocket = function(extensionSettings){
        // secure?

        var secure = false;


        var useCustomIP = extensionSettings['useCustomIP'];

        if(useCustomIP){
            console.log('using custom IP');
            var ip = extensionSettings['serverIP'];
            var port = extensionSettings['serverPort'];

            websocket.openWebsocket(ip, port, secure);
        }else{
             websocket.openWebsocket(defaultIP, defaultPort, secure);
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
    },

    that.init = init;
    that.openWebsocket = openWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.closeWebsocket = closeWebsocket;
    that.buttonClick = buttonClick;

    return that;
})();