CommunicationExtension.Settings = (function (){
    var that = {},
    debug = false,
    useCustomIP = false,
    defaultIP = "localhost",
    defaultPort = "8888",

    serverIP = defaultIP,
    serverPort = defaultPort,

    isDebuggerActive = false,

/* public methods */

    init = function(settings){
        if(settings != undefined){
            Logger.log("settings: ", settings);
            initSettings(settings);

            if(debug){
                Logger.log('settings init');
            }
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

    getIsDebuggerActive = function(){
        return isDebuggerActive;
    },

    activateDebuggerView = function(){
        isDebuggerActive = true;
    },

    deactivateDebuggerView = function(){
        isDebuggerActive = false;
    },

/* private methods */

    initSettings = function(settings){
        if(settings['useCustomIP'] != undefined){
            useCustomIP = settings['useCustomIP'];
        }

        if(settings['serverIP'] != undefined){
            serverIP = settings['serverIP'];
        }

        if(settings['serverPort'] != undefined){
            serverPort = settings['serverPort'];
        }

        if(settings['debug'] != undefined){
            debug = settings['debug'];
        }
        
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