/*
   Class: PageEventListener
   Used for checking for events
*/
CommunicationExtension.PageEventListener = (function (){
    var that = {},

    /* public methods */

    /* 
        Function: init
        Function which initialises the PageEventListener
    */
    init = function(){

        setListeners();

        return that;
    },

/* private methods */

    /* 
        Function: setListeners
        Sets listeners for the page events

    */
    setListeners = function(){

        //$(window).on('click', onClickEvent);

        $(window).on('scroll', onScrollEvent);

        $(window).on('hashchange', onURLChangeEvent);

        $(window).on('resize', onWindowResizeEvent);
    },

    /* 
        Function: onURLChangeEvent
        Listener for the URL change event

        Parameters:

            eventData - The data about the event
    */
    onURLChangeEvent = function(eventData){
        var object = new Object();
        object.command = "event";

        object.eventType = "url-change";

        object.eventtimestamp = eventData.timeStamp;

        object.height = window.innerHeight;
        object.width = window.innerWidth;

        $(that).trigger('event', object);
    },

    /* 
        Function: onWindowResizeEvent
        Listener for the window resize event

        Parameters:

            eventData - The data about the event
    */
    onWindowResizeEvent = function(eventData){
        var object = new Object();
        object.command = "event";

        object.eventType = "resize";

        object.eventtimestamp = Timestamp.getMillisecondsTimestamp();

        object.height = window.innerHeight;
        object.width = window.innerWidth;

        $(that).trigger('event', object);
    },

    /* 
        Function: onScrollEvent
        Listener for the scroll event

        Parameters:

            eventData - The data about the event
    */
    onScrollEvent = function(eventData){
        var object = new Object();
        object.command = "event";

        object.eventType = "scroll";

        object.eventtimestamp = Timestamp.getMillisecondsTimestamp();

        object.scrollx = window.scrollX;

        object.scrolly = window.scrollY;

        $(that).trigger('event', object);
    },

    /* 
        Function: onClickEvent
        Listener for the click event (currently not used)

        Parameters:

            event - The data about the event
    */
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