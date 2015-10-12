/*
   Class: DebuggerView
   Used for marking the currently checked coordinates
*/
CommunicationExtension.DebuggerView = (function (){
    var that = {},

    /* 
        Constant: debuggerElementClass
        Class for the debugger element
    */
    debuggerElementClass = "debugger-view-el";

    /* public methods */

    /* 
        Function: init
        Function which initialises the DebuggerView
    */
    init = function(){

        return that;
    },

    /* 
        Function: markPosition
        Function which marks the position with a debuggerview element

        Parameters:

          x - X Coordinate to mark
          y - Y Coordinate to mark
          color - color to create the marker in
    */
    markPosition = function(x, y, color){
        if(CommunicationExtension.Settings.getDebug()){
            var debugElement = '<div class="'+debuggerElementClass+'" style="position: absolute; left: '+x+'px; top: '+y+'px; background-color: '+color+'; width: 5px; height: 5px;"></div>';

            $("body").append(debugElement);
        }
    },

    /* 
        Function: getDebuggerElement
        Returns all currently existing debugger elements

    */
    getDebuggerElement = function(){
        return $('.'+debuggerElementClass);
    },

    /* 
        Function: removeDebuggerElement
        Removes all currently existing debugger elements

    */
    removeDebuggerElement = function(){
        getDebuggerElement().remove();
    },

    /* 
        Function: hideElement
        Hides all currently existing debugger elements

    */
    hideElement = function(){
       getDebuggerElement().hide();
    },

    /* 
        Function: showElement
        Shows all currently existing debugger elements

    */
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