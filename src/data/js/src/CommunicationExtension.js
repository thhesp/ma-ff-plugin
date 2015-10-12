/*
   Class: CommunicationExtension
   The scope of the plugin
*/
var CommunicationExtension = {

    /* 
        Variable: controller
        Reference to the CommunicationController
    */
    controller: null,

    /* 
        Variable: settings
        Reference to the Settings
    */
    settings: null,

    /* 
        Function: init
        Function which initialises the CommunicationExtension
    */
    init: function() {
        Logger.log("initialising");
        controller = this.CommunicationController.init();
        settings = this.Settings;
    },

    /* 
        Function: onOpen
        Gets called when a tab gets opened
    */
    onOpen: function(extensionSettings){
        settings = settings.init(extensionSettings);

        Logger.log('open extension object');

        controller.openWebsocket();
    },
    
    /* 
        Function: onRestart
        Gets called when the extension code needs to be restarted. Mainly the websocket connections.
    */
    onRestart: function(extensionSettings){
        settings = settings.init(extensionSettings);

        Logger.error(extensionSettings);

        controller.restartWebsocket();
    },

    /* 
        Function: onClick
        Gets called when a click event gets sent from the firefox sdk
    */
    onClick: function(){
        Logger.log('click extension object');
        controller.buttonClick();
    },

    /* 
        Function: onClose
        Gets called when the tab gets closed
    */
    onClose: function(){
        Logger.log('close extension object');
        controller.closeWebsocket();
    },

    /* 
        Function: onActivateTab
        Gets called when the tab gets activated
    */
    onActivateTab: function(){
        Logger.log('activate Tab');
        controller.activateTab();
    },

    /* 
        Function: onDeactivateTab
        Gets called when the tab gets deactivated
    */
    onDeactivateTab: function(){
        Logger.log('deactivate Tab');
        controller.deactivateTab();
    },

    /* 
        Function: onConnectionClosed
        Gets called when the websocket connection closes
    */
    onConnectionClosed: function(){
        self.port.emit("connectionClosed");
    },

    /* 
        Function: onConnectionError
        Gets called when the an error happend with the websocket connection
    */
    onConnectionError: function(){
        self.port.emit("connectionError");
    },

    /* 
        Function: onConnectionComplete
        Gets called when the websocket connection was successfully established
    */
    onConnectionComplete: function(){
        self.port.emit("connectionComplete");
    }
};