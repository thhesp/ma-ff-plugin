CommunicationExtension.DataModel = (function (){
    var that = {},
    object = null,


    /* public methods */

    init = function(messageObject){

        object = messageObject;

        object.command = 'data';

        console.log("Position: ", messageObject.x, messageObject.y);

        var el = document.elementFromPoint(messageObject.x,messageObject.y);
 
        //printNodeData(el);
        extractNodeData(el);

        return that;
    },

    exportForJSON = function(){
        return object;
    }

    /* private methods */

    extractNodeData = function(el){
        object.data = [];
        extractTag(el);
        extractID(el);
        extractClasses(el);
        extractTitle(el);
        extractAttributes(el);
    },

    extractID = function(el){
        var obj = new Object();

        if(el.id){
            obj.id = el.id;
        }else{
            obj.id = "";
        }

        object.data.push(obj);
    },

    extractClasses = function(el){
        var classes = [];
        for(var i = 0; i < el.classList.length; i++){
            classes.push(el.classList[i]);
        }

        var obj = new Object();

        obj.classes = classes;

        object.data.push(obj);
    },

    extractTag = function(el){
        var obj = new Object();

        obj.tag = el.tagName;

        object.data.push(obj);
    },

    extractTitle = function(el){
        var obj = new Object();

        if(el.title){
            obj.title = el.title;
        }else{
            obj.title = "";
        }

        object.data.push(obj);
    },

    extractAttributes = function(el){
        var attributes = [];
        for(var i = 0; i < el.attributes.length; i++){
            var attr = new Object();
            attr.name = el.attributes[i].name;
            attr.value = el.attributes[i].value;

            attributes.push(attr);
        }

        var obj = new Object();

        obj.attributes = attributes;

        object.data.push(obj);
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