CommunicationExtension.DataModel = (function (){
    var that = {},

    object = null,
    debuggerView = null,


    /* public methods */

    init = function(messageObject){

        debuggerView = CommunicationExtension.DebuggerView.init();

        object = messageObject;

        Logger.log("Browserposition: ", window.screenX, window.screenY);

        Logger.log("Position: ", messageObject.x, messageObject.y);

        //get height of toolbar etc. (not really working with the browser console open)
        var toolbarHeight = window.outerHeight - window.innerHeight;

        //map screen position to inner browser position and overall browser position
        var realX = messageObject.x - window.screenX;

        var realY = messageObject.y - window.screenY - toolbarHeight;

        debuggerView.markPosition(realX, realY);

        if(realX >= 0 && realY >= 0){
            object.command = 'data';

            //hide element so it won't be used
            debuggerView.hideElement();

            var el = document.elementFromPoint(realX,realY);

            // show the element
            debuggerView.showElement();
     
            //printNodeData(el);
            if(el != null && el != undefined){
                extractNodeData(el);
            }else{
                createErrorMessage();
            }
        }else{
            createErrorMessage();
        }


        return that;
    },

    createErrorMessage = function(){
        object.command = 'error';

        object.errorCode = "???";
        object.error = "Coordinates are outside of the browser window";
    },

    exportForJSON = function(){
        return object;
    }

    /* private methods */

    extractNodeData = function(el){
        extractTag(el);
        extractID(el);
        extractClasses(el);
        extractTitle(el);
        extractAttributes(el);
        extractElementDimensions(el);
    },

    extractID = function(el){
        if(el.id){
            object.id = el.id;
        }else{
            object.id = "";
        }
    },

    extractClasses = function(el){
        var classes = [];
        for(var i = 0; i < el.classList.length; i++){
            classes.push(el.classList[i]);
        }

        object.classes = classes;
    },

    extractTag = function(el){
        object.tag = el.tagName;
    },

    extractTitle = function(el){
        if(el.title){
            object.title = el.title;
        }else{
            object.title = "";
        }
    },

    extractAttributes = function(el){
        var attributes = [];
        for(var i = 0; i < el.attributes.length; i++){
            var attr = new Object();
            attr.name = el.attributes[i].name;
            attr.value = el.attributes[i].value;

            attributes.push(attr);
        }

        object.attributes = attributes;
    },

    extractElementDimensions = function(el){
        object.element = new Object();

        object.element.top = $(el).position().top;
        object.element.left = $(el).position().left;
        object.element.width = $(el).width();
        object.element.height = $(el).height();
        object.element.outerWidth = $(el).outerWidth(true);
        object.element.outerHeight = $(el).outerHeight(true);
    },

    printNodeData = function(el){
        Logger.log('Element: ', el);

        Logger.log('Attributes: ', el.attributes);

        Logger.log('ClassList: ', el.classList);

        Logger.log('id: ', el.id);

        Logger.log('innerHTML: ', el.innerHTML);

        Logger.log('nodeName: ', el.nodeName);

        Logger.log('nodeType: ', el.nodeType);

        Logger.log('nodeValue: ', el.nodeValue);

        Logger.log('parentNode: ', el.parentNode);

        Logger.log('parentElement: ', el.parentElement);

        Logger.log('tagName: ', el.tagName);

        Logger.log('title: ', el.title);

        Logger.log('toString: ', el.toString());
    };

    that.init = init;
    that.exportForJSON = exportForJSON;


    return that;
})();