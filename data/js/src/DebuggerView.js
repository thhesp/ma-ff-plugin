CommunicationExtension.DebuggerView = (function (){
    var that = {},

    debuggerElementId = "debugger-view-el";

    /* public methods */

    init = function(){

        return that;
    },

    markPosition = function(x, y, color){
        getDebuggerElement().remove();

        var debugElement = '<div id="'+debuggerElementId+'" style="position: absolute; left: '+x+'px; top: '+y+'px; background-color: '+color+'; width: 5px; height: 5px;"></div>';

        $("body").append(debugElement);
    },

    getDebuggerElement = function(){
        return $('#'+debuggerElementId);
    },


    hideElement = function(){
       getDebuggerElement().hide();
    },

    showElement = function(){
        getDebuggerElement().show();
    };

    that.init = init;
    that.markPosition = markPosition;
    that.hideElement = hideElement;
    that.showElement = showElement;

    return that;
})();