var Timestamp = {

    getUnixTimestamp: function(){
        var date = new Date();

        var offset = -(date.getTimezoneOffset() * 60);

        var timestamp = Math.round(new Date().getTime() / 1000) + offset;

        return timestamp;
    },

    getMillisecondsTimestamp: function(){
        var date = new Date();

        var offset = -(date.getTimezoneOffset() * 60 * 1000);

        var timestamp = new Date().getTime() + offset;

        return timestamp;
    }
};