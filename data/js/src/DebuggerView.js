CommunicationExtension.DebuggerView = (function (){
    var that = {},

    debuggerElementClass = "debugger-view-el";

    /* public methods */

    init = function(){

        return that;
    },

    markPosition = function(x, y, color){
        var debugElement = '<div class="'+debuggerElementClass+'" style="position: absolute; left: '+x+'px; top: '+y+'px; background-color: '+color+'; width: 5px; height: 5px;"></div>';

        $("body").append(debugElement);
    },

    getDebuggerElement = function(){
        return $('.'+debuggerElementClass);
    },

    removeDebuggerElement = function(){
        getDebuggerElement().remove();
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
    that.removeDebuggerElement = removeDebuggerElement;

    return that;
})();