/*
   Class: Logger
   A class for logging messages to the console.
*/

var Logger = {

      /*
        Function: log
        Logs the given arguments to the console
      */
    log: function(){
        for(var i = 0; i < arguments.length; i++){
            console.log(window.location.href, ' - ', Timestamp.getMillisecondsTimestamp(),':', arguments[i]);
        }
    },

      /*
        Function: error
        Logs the given arguments to the error console
      */
    error: function(){
        for(var i = 0; i < arguments.length; i++){
            console.error(window.location.href, ' - ', Timestamp.getMillisecondsTimestamp(),':', arguments[i]);
        }
    }

};