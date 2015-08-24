var CommunicationExtension = {

    controller: null,
    settings: null,

    init: function() {
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

        Logger.error("Debug: ", settings.getDebug());

        Logger.log('restart extension object');

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

    onActivateTab: function(tabUrl){
        /*var thisUrl = window.location.href;

        Logger.log('activate tab: ' + thisUrl);

        Logger.log('activated tab: ' + tabUrl);

        if(thisUrl == tabUrl){
            controller.activateTab();
        }else{
            controller.deactivateTab();
        }*/

    },

    onDeactivateTab: function(tabUrl){
        /*var thisUrl = window.location.href;

        Logger.log('deactivate tab: ' + thisUrl);

        Logger.log('deactivated tab: ' + tabUrl);

        if(thisUrl == tabUrl){
            controller.deactivateTab();
        }*/
    }

};