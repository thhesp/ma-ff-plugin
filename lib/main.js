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

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./img/icon-16.png",
    "32": "./img/icon-32.png",
    "64": "./img/icon-64.png"
  },
  onClick: handleClick
});

function sendWorkerMessage(type, message){
  console.log("sendWorkerMessage: ", workers, type, message);
  for(var i = 0; i < workers.length; i++){
    console.log("worker: ", workers[i]);
    workers[i].port.emit(type, message);
  }
}

function handleClick(state) {
  //tabs.open("https://www.mozilla.org/");

  // When the connection is open, send some data to the server
  //connection.send("Test send?!"); 
  sendWorkerMessage("click", "Message from the add-on");
}

tabs.on("ready", function(tab) {

  var newWorker = tab.attach({
    //contentScriptFile: [self.data.url("./js/jquery-2.1.3.min.js"), self.data.url("./js/websockets.js")],
    contentScriptFile: [
                        self.data.url("./js/lib/jquery-2.1.3.min.js"),

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
  newWorker.port.emit("activate", tabs.activeTab.url);

  workers.push(newWorker);
});

tabs.on("activate", function(tab){
  sendWorkerMessage("activate", tabs.activeTab.url);
});

function onPrefChange(prefName){
  sendWorkerMessage("restart", simplePrefs.prefs);
}

simplePrefs.on("", onPrefChange);


tabs.open("http://stackoverflow.com");