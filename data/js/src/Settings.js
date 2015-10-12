/*
   Class: Settings
   Contain the plugin settings
*/
CommunicationExtension.Settings = (function (){
    var that = {},

    /* 
        Variable: debug
        Is the debugging mode on
    */
    debug = false,

    /* 
        Variable: useCustomIP
        Use a custom IP
    */
    useCustomIP = false,

    /* 
        Constant: defaultIP
        The default IP
    */
    defaultIP = "localhost",

    /* 
        Constant: defaultPort
        The default Port
    */
    defaultPort = "8888",

    /* 
        Variable: serverIP
        The server IP from the settings
    */
    serverIP = defaultIP,

    /* 
        Variable: serverPort
        The server Port from the settings
    */
    serverPort = defaultPort,

    /* 
        Variable: isDebuggerActive
        Is the debugging view currently displayed
    */
    isDebuggerActive = false,

/* public methods */

    /* 
        Function: init
        Function which initialises the DebuggerView


        Parameters:

          settings - Reference to the plugin settings

    */
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

    /* 
        Function: getDefaultIP
        Returns the default IP
    */
    getDefaultIP = function(){
        return defaultIP;
    },

    /* 
        Function: getDefaultPort
        Returns the default Port
    */
    getDefaultPort = function(){
        return defaultPort;
    },

    /* 
        Function: getDebug
        Returns if the debugging mode is on or not
    */
    getDebug = function(){
        return debug;
    },

    /* 
        Function: getUseCustomIP
        Returns if a custom ip shall be used
    */
    getUseCustomIP = function(){
        return useCustomIP;
    },

    /* 
        Function: getServerIP
        Returns the server ip
    */
    getServerIP = function(){
        return serverIP;
    },

    /* 
        Function: getServerPort
        Returns the server port
    */
    getServerPort = function(){
        return serverPort;
    },

    /* 
        Function: getIsDebuggerActive
        Returns if an debuggerview element is active
    */
    getIsDebuggerActive = function(){
        return isDebuggerActive;
    },

    /* 
        Function: activateDebuggerView
        Activates the debuggerview
    */
    activateDebuggerView = function(){
        isDebuggerActive = true;
    },

    /* 
        Function: deactivateDebuggerView
        Deactivates the debuggerview
    */
    deactivateDebuggerView = function(){
        isDebuggerActive = false;
    },

/* private methods */

    /* 
        Function: initSettings
        Initialises the settings from the plugin settings


        Parameters:

          settings - Reference to the plugin settings

    */
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