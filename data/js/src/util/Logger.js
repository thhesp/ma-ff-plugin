var Logger = {

    log: function(){
        if(CommunicationExtension.Settings.getDebug()){
            for(var i = 0; i < arguments.length; i++){
                console.log(window.location.href, ' - ', Timestamp.getMillisecondsTimestamp(),':', arguments[i]);
            }
        }
    },

    error: function(){
    	console.error(window.location.href, ' - ', Timestamp.getMillisecondsTimestamp(),':', arguments);
    }

};