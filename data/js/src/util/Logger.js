var Logger = {

    log: function(message){
        if(CommunicationExtension.Settings.getDebug()){
            console.log(Timestamp.getMillisecondsTimestamp(),':',message);
        }
    },

    error: function(message){
    	console.error(Timestamp.getMillisecondsTimestamp(),':',message);
    }

};