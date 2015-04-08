var CommunicationExtension = {

    controller: null,

    init: function() {
        console.log('init extension object');
        controller = this.CommunicationController.init();
    },

    onOpen: function(settings){
        console.log('open extension object');
        controller.openWebsocket(settings);
    },
    
    onRestart: function(settings){
        console.log('restart extension object');
        controller.restartWebsocket(settings);
    },

    onClick: function(){
        console.log('click extension object');
        controller.buttonClick();
    },

    onClose: function(){
        console.log('close extension object');
        controller.closeWebsocket();
    }

};