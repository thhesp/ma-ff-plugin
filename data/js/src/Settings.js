CommunicationExtension.Settings = (function (){
    var that = {},
    debug = true,
    useCustomIP = false,
    defaultIP = "localhost",
    defaultPort = "8888",

    serverIP = defaultIP,
    serverPort = defaultPort,

/* public methods */

    init = function(settings){
        initSettings(settings);

        if(debug){
            Logger.log('settings init');
        }
        
        return that;
    },

    getDefaultIP = function(){
        return defaultIP;
    },

    getDefaultPort = function(){
        return defaultPort;
    },

    getDebug = function(){
        return debug;
    },

    getUseCustomIP = function(){
        return useCustomIP;
    },

    getServerIP = function(){
        return serverIP;
    },

    getServerPort = function(){
        return serverPort;
    },

/* private methods */

    initSettings = function(settings){
        useCustomIP = settings['useCustomIP'];
        serverIP = settings['serverIP'];
        serverPort = settings['serverPort'];
        debug = settings['debug'];
    };

    that.init = init;

    that.getDefaultIP = getDefaultIP;
    that.getDefaultPort = getDefaultPort;

    that.getDebug = getDebug;
    that.getUseCustomIP = getUseCustomIP;
    that.getServerIP = getServerIP;
    that.getServerPort = getServerPort;

    return that;
})();