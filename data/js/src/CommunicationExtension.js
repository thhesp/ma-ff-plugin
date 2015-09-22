var CommunicationExtension = {

    controller: null,
    settings: null,

    init: function() {
        Logger.log("initialising");
        controller = this.CommunicationController.init();
        settings = this.Settings;
    },

    onOpen: function(extensionSettings){
        settings = settings.init(extensionSettings);

        Logger.log('open extension object');

        controller.openWebsocket();
    },
    
    onRestart: function(extensionSettings){
        settings = settings.init(extensionSettings);

        Logger.error(extensionSettings);

        controller.restartWebsocket();
    },

    onClick: function(){
        Logger.log('click extension object');
        controller.buttonClick();
    },

    onClose: function(){
        Logger.log('close extension object');
        controller.closeWebsocket();
    },

    onActivateTab: function(){
        Logger.log('activate Tab');
        controller.activateTab();
    },

    onDeactivateTab: function(){
        Logger.log('deactivate Tab');
        controller.deactivateTab();
    },

    onConnectionClosed: function(){
        self.port.emit("connectionClosed");
    },

    onConnectionError: function(){
        self.port.emit("connectionError");
    },

    onConnectionComplete: function(){
        self.port.emit("connectionComplete");
    }
};