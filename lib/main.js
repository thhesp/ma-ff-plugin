var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var pageWorker = require("sdk/page-worker");
var simplePrefs = require('sdk/simple-prefs');

var workers = [];

var prefName = 'extensions.flexibleWebsiteAddon.sdk.console.logLevel';
var logLevel = 'all';
require("sdk/preferences/service").set(prefName, logLevel);

var wsUnsecure = 'network.websocket.allowInsecureFromHTTPS';

require("sdk/preferences/service").set(wsUnsecure, true);

const errorState = {
  "label": "Websocket Status: Not Connected",
  "icon": {
    "16": "./img/error-16.png",
    "32": "./img/error-32.png",
    "48": "./img/error-64.png"
  }
}

const okState = {
  "label": "Websocket Status: Connected",
  "icon": {
    "16": "./img/ok-16.png",
    "32": "./img/ok-32.png",
    "48": "./img/ok-64.png"
  }
}


var button = buttons.ActionButton({
  id: "connection-identifier",
  label: "Websocket Status: Not Connected",
  icon: {
    "16": "./img/error-16.png",
    "32": "./img/error-32.png",
    "48": "./img/error-64.png"
  }
});

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

function removeOldWorker(tab){
  for(var i = workers.length -1; i >= 0 ; i--){
    if(workers[i].tab == tab){
        workers.splice(i, 1);
    }
  }
}

function onConnectionClosed(event){
  button.state(button, errorState);
}

function onConnectionError(event){
  button.state(button, errorState);
}

function onConnectionComplete(event){
  button.state(button, okState);
}

tabs.on("ready", function(tab) {

  console.log("tab ready: ", tab);

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

  newWorker.port.emit("open", simplePrefs.prefs);
  //newWorker.port.emit("activate", tabs.activeTab.url);

  newWorker.port.on("connectionClosed", onConnectionClosed);

  newWorker.port.on("connectionError", onConnectionError);

  newWorker.port.on("connectionComplete", onConnectionComplete);

  workers.push(newWorker);
});

tabs.on("activate", function(tab){
  sendWorkerMessage(tab, "activate", tabs.activeTab.url);
});

function onPrefChange(prefName){
  sendWorkerMessage(tab, "restart", simplePrefs.prefs);
}

simplePrefs.on("", onPrefChange);