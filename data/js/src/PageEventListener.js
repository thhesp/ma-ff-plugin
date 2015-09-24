CommunicationExtension.PageEventListener = (function (){
    var that = {},

    /* public methods */

    init = function(){

        setListeners();

        return that;
    },

/* private methods */

    setListeners = function(){

        //$(window).on('click', onClickEvent);

        $(window).on('scroll', onScrollEvent);

        $(window).on('hashchange', onURLChangeEvent);

        $(window).on('resize', onWindowResizeEvent);
    },

    onURLChangeEvent = function(event){
        var object = new Object();
        object.command = "event";

        object.eventType = "url-change";

        object.eventtimestamp = event.timeStamp;

        object.url = window.location.href;

        object.height = window.innerHeight;
        object.width = window.innerWidth;

        $(that).trigger('event', object);
    },

    onWindowResizeEvent = function(event){
        var object = new Object();
        object.command = "event";

        object.eventType = "resize";

        object.eventtimestamp = event.timeStamp;

        object.height = window.innerHeight;
        object.width = window.innerWidth;

        $(that).trigger('event', object);
    },

    onScrollEvent = function(event){
        var object = new Object();
        object.command = "event";

        object.eventType = "scroll";

        object.eventtimestamp = event.timeStamp;

        object.scrollx = window.scrollX;

        object.scrolly = window.scrollY;

        $(that).trigger('event', object);
    },

    onClickEvent = function(event){

        var object = new Object();
        object.command = "event"

        object.eventType = "click";

        object.eventtimestamp = event.timeStamp;

        object.clickx = event.pageX;

        object.clicky = event.pageY;

        Logger.log(event.target);

        $(that).trigger('event', object);
    }; 


    that.init = init;

    return that;
})();