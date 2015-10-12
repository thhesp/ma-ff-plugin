/*
  File: main.js
  This file is the entry point for the firefox plugin
*/


/* 
  Variable: buttons
  Reference to the firefox sdk buttons
*/
var buttons = require('sdk/ui/button/action');

/* 
  Variable: self
  Reference to the firefox sdk self
*/
var self = require("sdk/self");

/* 
  Variable: tabs
  Reference to the firefox sdk tabs
*/
var tabs = require("sdk/tabs");

/* 
  Variable: pageWorker
  Reference to the firefox sdk page worker
*/
var pageWorker = require("sdk/page-worker");

/* 
  Variable: simplePrefs
  Reference to the firefox sdk simplePrefs
*/
var simplePrefs = require('sdk/simple-prefs');

/* 
  Variable: workers
  Array with all workers (references to plugin code in tabs)
*/
var workers = [];


var prefName = 'extensions.webanalyzerplugin.sdk.console.logLevel';
var logLevel = 'all';
require("sdk/preferences/service").set(prefName, logLevel);

var wsUnsecure = 'network.websocket.allowInsecureFromHTTPS';

require("sdk/preferences/service").set(wsUnsecure, true);


/* 
  Variable: errorState
  Informations about the icon used for the websocket indicator error state
*/
const errorState = {
  "label": "Websocket Status: Not Connected",
  "icon": {
    "16": "./img/error-16.png",
    "32": "./img/error-32.png",
    "48": "./img/error-64.png"
  }
}

/* 
  Variable: okState
  Informations about the icon used for the websocket indicator ok state
*/
const okState = {
  "label": "Websocket Status: Connected",
  "icon": {
    "16": "./img/ok-16.png",
    "32": "./img/ok-32.png",
    "48": "./img/ok-64.png"
  }
}

/* 
  Variable: button
  The websocket connection indicator
*/
var button = buttons.ActionButton({
  id: "connection-identifier",
  label: "Websocket Status: Not Connected",
  icon: {
    "16": "./img/error-16.png",
    "32": "./img/error-32.png",
    "48": "./img/error-64.png"
  }
});


/* 
  Function: sendWorkerMessage
  Message for sending messages to the plugin code

  Parameters:

    tab - The currently activate tab
    type - The message type
    message - The message

*/
function sendWorkerMessage(tab, type, message){
  console.log("sendWorkerMessage: ", workers, type, message);

  if(type == "activate"){
    //sent activate to the active tab, and deactivate to the others
      for(var i = workers.length -1; i >= 0 ; i--){
        if(workers[i].tab == tab){
          workers[i].port.emit("activate", message);
        }else{
          workers[i].port.emit("deactivate", message);
        }
      }
  }else{
      //just send the message
      for(var i = 0; i < workers.length; i++){
        console.log("worker: ", workers[i]);
        workers[i].port.emit(type, message);
      }
  }
}

/* 
  Function: removeOldWorker
  Removes old reference to the worker for the active tab

  Parameters:
    tab - The currently activate tab

*/
function removeOldWorker(tab){
  for(var i = workers.length -1; i >= 0 ; i--){
    if(workers[i].tab == tab){
        workers.splice(i, 1);
    }
  }
}

/* 
  Function: onConnectionClosed
  Gets called when the websocket connection was closed
*/
function onConnectionClosed(){
  button.state("tab", errorState);
}

/* 
  Function: onConnectionError
  Gets called when an error happend on the websocket connection
*/
function onConnectionError(){
  button.state("tab", errorState);
}

/* 
  Function: onConnectionComplete
  Gets called when the websocket connection was opened succesfully
*/
function onConnectionComplete(){
  button.state("tab", okState);
}

/* 
  Function: tabs.on("ready")
  Gets called when a new tab gets opened.
  Loads the plugin code to the tab, sets all necessary listeners and starts the code.
*/
tabs.on("ready", function(tab) {

  console.log("tab ready", tab.title, tab.url);

  removeOldWorker(tab);
  
  var newWorker = tab.attach({
    //contentScriptFile: [self.data.url("./js/jquery-2.1.3.min.js"), self.data.url("./js/websockets.js")],
    contentScriptFile: [
                        self.data.url("./js/lib/jquery-2.1.3.min.js"),
                        self.data.url("./js/lib/css-selector-generator.min.js"),

                        self.data.url("./js/src/util/Timestamp.js"),
                        self.data.url("./js/src/util/Logger.js"),

                        self.data.url("./js/src/CommunicationExtension.js"),
                        self.data.url("./js/src/Settings.js"),
                        self.data.url("./js/src/WebsocketController.js"),
                        self.data.url("./js/src/CommunicationController.js"),
                        self.data.url("./js/src/DataModel.js"),
                        self.data.url("./js/src/PageEventListener.js"),
                        self.data.url("./js/src/DebuggerView.js"),


                        self.data.url("./js/init.js")
                      ]
  });


  console.log('vor open');

  newWorker.port.emit("open", simplePrefs.prefs);
  //newWorker.port.emit("activate", tabs.activeTab.url);

  console.log('nach open');

  newWorker.port.on("connectionClosed", onConnectionClosed);

  newWorker.port.on("connectionError", onConnectionError);

  newWorker.port.on("connectionComplete", onConnectionComplete);

  workers.push(newWorker);
});

/* 
  Function: tabs.on("activate")
  Gets called when a tab gets activated
*/
tabs.on("activate", function(tab){
  sendWorkerMessage(tab, "activate", tabs.activeTab.url);
});

/* 
  Function: onPrefChange
  Gets called when the plugin settings get changed
*/
function onPrefChange(prefName){
  sendWorkerMessage(tab, "restart", simplePrefs.prefs);
}

simplePrefs.on("", onPrefChange);