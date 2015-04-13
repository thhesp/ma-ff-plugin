CommunicationExtension.DataModel = (function (){
    var that = {},
    object = null,


    /* public methods */

    init = function(messageObject){

        object = messageObject;

        object.command = 'data';

        console.log("Browserposition: ", window.screenX, window.screenY);

        console.log("Position: ", messageObject.x, messageObject.y);

        //map screen position to inner browser position

        var realX = messageObject.x - window.screenX;

        var realY = messageObject.y - window.screenY;

        if(realX >= 0 && realY >= 0){
            var el = document.elementFromPoint(realX,realY);
     
            //printNodeData(el);
            extractNodeData(el);
        }else{
            object.errorCode = "???";
            object.error = "Coordinates are outside of the browser window";
        }


        return that;
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

    printNodeData = function(el){
        console.log('Element: ', el);

        console.log('Attributes: ', el.attributes);

        console.log('ClassList: ', el.classList);

        console.log('id: ', el.id);

        console.log('innerHTML: ', el.innerHTML);

        console.log('nodeName: ', el.nodeName);

        console.log('nodeType: ', el.nodeType);

        console.log('nodeValue: ', el.nodeValue);

        console.log('parentNode: ', el.parentNode);

        console.log('parentElement: ', el.parentElement);

        console.log('tagName: ', el.tagName);

        console.log('title: ', el.title);

        console.log('toString: ', el.toString());
    };

    that.init = init;
    that.exportForJSON = exportForJSON;


    return that;
})();