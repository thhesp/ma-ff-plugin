var Logger = {

    log: function(message){
        if(CommunicationExtension.Settings.getDebug()){
            console.log(window.location.href, ' - ', Timestamp.getMillisecondsTimestamp(),':',message);
        }
    },

    error: function(message){
    	console.error(window.location.href, ' - ', Timestamp.getMillisecondsTimestamp(),':',message);
    }

};