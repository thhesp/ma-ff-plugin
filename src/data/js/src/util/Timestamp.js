/*
   Class: Timestamp
   A class for generating timestamps
*/
var Timestamp = {

      /*
        Function: getUnixTimestamp
        Returns a unix timestamp
      */
    getUnixTimestamp: function(){
        var date = new Date();

        var offset = -(date.getTimezoneOffset() * 60);

        var timestamp = Math.round(new Date().getTime() / 1000) + offset;

        return parseInt(timestamp);
    },

    /*
        Function: getMillisecondsTimestamp
        Returns a timestamp in milliseconds
    */
    getMillisecondsTimestamp: function(){
        var date = new Date();

        var offset = -(date.getTimezoneOffset() * 60 * 1000);

        var timestamp = new Date().getTime() + offset;

        return parseInt(timestamp);
    }
};