CommunicationExtension.DebuggerView = (function (){
    var that = {},

    debuggerElementId = "debugger-view-el";

    /* public methods */

    init = function(){

        return that;
    },

    markPosition = function(x, y){
        $('#'+debuggerElementId).remove();

        var debugElement = '<div id="'+debuggerElementId+'" style="position: absolute; left: '+x+'px; top: '+y+'px; background-color: red; width: 5px; height: 5px;"></div>';

        $("body").append(debugElement);
    };

    that.init = init;
    that.markPosition = markPosition;

    return that;
})();