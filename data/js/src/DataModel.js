/*
   Class: DataModel
   Used for extracting data about an element.
*/
CommunicationExtension.DataModel = (function (){
    var that = {},

    /* 
        Variable: object
        Reference to the current message object
    */
    object = null,

    /* 
        Variable: debuggerView
        Reference to the DebuggerView
    */
    debuggerView = null,

    /* 
        Variable: pathGenerator
        Reference to the CSSSelectorGenerator
    */
    pathGenerator = new CssSelectorGenerator,


    /* public methods */

    /* 
        Function: init
        Function which initialises the DataModel

        Parameters:

          messageObject - The message object which was received
    */
    init = function(messageObject){

        debuggerView = CommunicationExtension.DebuggerView.init();

        object = messageObject;

        object.command = 'data';

        Logger.log("Browserposition: " + window.screenX  + "/"+ window.screenY);

        //get height of toolbar etc. (not really working with the browser console open)
        var toolbarHeight = window.outerHeight - window.innerHeight;

        Logger.log("Toolbarheight: " + toolbarHeight);


        debuggerView.removeDebuggerElement();

        if(object.left != null && object.right != null){
            // "big" message
            analyzeData(object.left, toolbarHeight, "red");
            analyzeData(object.right, toolbarHeight, "blue");
        }else if(object.x != null && object.y != null ){
            // "small" message
            analyzeData(object, toolbarHeight, "blue");
        }



        return that;
    },


    /* 
        Function: analyzeData
        Analyses the data and extracts the element informations

        Parameters:

          eyeObject - Reference to a part of the message object
          toolbarHeight - current height of the toolbar
          markColor - Color of the debuggerview (if used)
    */
    analyzeData = function(eyeObject, toolbarHeight, markColor) {

        //map screen position to inner browser position and overall browser position
        var realX = eyeObject.x - window.mozInnerScreenX;

        var realY = eyeObject.y - window.mozInnerScreenY;

        //calculate scroll position?
        realX += scrollX;
        realY += scrollY;

        Logger.log("Real x: "+ realX + " / y: " + realY);

        debuggerView.markPosition(realX, realY, markColor);

        if(realX >= 0 && realY >= 0){
            //hide element so it won't be used
            debuggerView.hideElement();

            var el = document.elementFromPoint(realX,realY);

            // show the element
            debuggerView.showElement();
     
            //printNodeData(el);
            if(el != null && el != undefined){
                eyeObject.htmlX = parseFloat(realX);
                eyeObject.htmlY = parseFloat(realY);

                console.log("EyeObject: ", eyeObject);

                extractNodeData(eyeObject, el);
            }else{
                createNotFoundMessage(eyeObject);
            }
        }else{
            createCoordinatesErrorMessage(eyeObject);
        }
    },

    /* 
        Function: exportForJSON
        Returns the enriched message object to be sent back to the server
    */
    exportForJSON = function(){
        return object;
    },

    /* private methods */

    /* 
        Function: createNotFoundMessage
        If no element was at the given coordinates the message object gets changed to represent it.

        Parameters:

          eyeObject - Reference to a part of the message object
    */
    createNotFoundMessage = function(eyeObject){
        eyeObject.command = 'error';

        eyeObject.errorCode = "???";
        eyeObject.error = "No Element was Found at this location.";
    },

    /* 
        Function: createCoordinatesErrorMessage
        If the coordinates are not within the browser the message object gets changed to represent it.

        Parameters:

          eyeObject - Reference to a part of the message object
    */
    createCoordinatesErrorMessage = function(eyeObject){
        eyeObject.command = 'error';

        eyeObject.errorCode = "???";
        eyeObject.error = "Coordinates are outside of the browser window";
    },

    /* 
        Function: extractNodeData
        Extracts all necessary informations about the given element and adds them to the eyeObject

        Parameters:

          eyeObject - Reference to a part of the message object
          el - The element with is at the given coordinates
    */
    extractNodeData = function(eyeObject, el){
        eyeObject.tag = extractTag(el);
    
        // removed because they are in attributes
        //eyeObject.id = extractID(el);
        //eyeObject.classes = extractClasses(el);
        //eyeObject.title = extractTitle(el);

        eyeObject.attributes = extractAttributes(el);
        eyeObject.element = extractElementDimensions(el);
        eyeObject.selector = extractCSSPath(el);

        eyeObject.path = extractFullDOMPath(el);
        //console.log("css path: ", extractCSSPath(el));
    },

    /* 
        Function: extractID
        Extracts the id of the element

        Parameters:

          el - HTML Element
    */
    extractID = function(el){
        if(el.id){
            return el.id;
        }else{
            return "";
        }
    },

    /* 
        Function: extractClasses
        Extracts the classes of the element

        Parameters:

          el - HTML Element
    */
    extractClasses = function(el){
        var classes = [];
        for(var i = 0; i < el.classList.length; i++){
            classes.push(el.classList[i]);
        }

        return classes;
    },

    /* 
        Function: extractTag
        Extracts the tag of the element

        Parameters:

          el - HTML Element
    */
    extractTag = function(el){
        return el.tagName.toLowerCase();
    },

    /* 
        Function: extractTitle
        Extracts the title of the element

        Parameters:

          el - HTML Element
    */
    extractTitle = function(el){
        if(el.title){
            return el.title;
        }else{
            return "";
        }
    },

    /* 
        Function: extractAttributes
        Extracts the attributes of the element

        Parameters:

          el - HTML Element
    */
    extractAttributes = function(el){
        var attributes = [];
        for(var i = 0; i < el.attributes.length; i++){
            var attr = new Object();
            attr.name = el.attributes[i].name;
            attr.value = el.attributes[i].value;

            attributes.push(attr);
        }

        return attributes;
    },

    /* 
        Function: extractElementDimensions
        Extracts the element dimensions of the element

        Parameters:

          el - HTML Element
    */
    extractElementDimensions = function(el){
        var element = new Object();

        element.top = $(el).position().top;
        element.left = $(el).position().left;
        element.width = $(el).width();
        element.height = $(el).height();
        element.outerWidth = $(el).outerWidth(true);
        element.outerHeight = $(el).outerHeight(true);

        return element;
    },

    /* 
        Function: extractCSSPath
        Extracts the css path of the element with the help of the css path generator

        Parameters:

          el - HTML Element
    */
    extractCSSPath = function(el){
        return pathGenerator.getSelector(el);
    },

    /* 
        Function: extractFullDOMPath
        Extracts the full path from the html base element to the element

        Parameters:

          el - HTML Element
    */
    extractFullDOMPath = function(el){
        var parentEls = $( el ).parents()
          .map(function() {
            return extractAnchestorIdentifier(this);
          })
          .get()
          .reverse()
          .join( " > " );

          return parentEls;
    },

    /* 
        Function: extractAnchestorIdentifier
        Creates the identifier with tag, id and classes for an element

        Parameters:

          anchestor - HTML Element
    */
    extractAnchestorIdentifier = function(anchestor){
        var identifier = anchestor.tagName.toLowerCase();

        if(anchestor.id){
            identifier += '#' + anchestor.id;
        }

        if(anchestor.classList.Length != 0){
            var classes = "";
            for(var i = 0; i < anchestor.classList.length; i++){
                classes += '.' + anchestor.classList[i];
            }

            identifier += classes;
        }

        return identifier;
    },

    /* 
        Function: printNodeData
        Logs data about the element

        Parameters:

          el - HTML Element
    */
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