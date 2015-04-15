var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var pageWorker = require("sdk/page-worker");
var simplePrefs = require('sdk/simple-prefs');

var worker;

var prefName = 'extensions.flexibleWebsiteAddon.sdk.console.logLevel';
var logLevel = 'all';
require("sdk/preferences/service").set(prefName, logLevel);


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

function handleClick(state) {
  //tabs.open("https://www.mozilla.org/");

  // When the connection is open, send some data to the server
  //connection.send("Test send?!"); 
  worker.port.emit("click", "Message from the add-on");
}

tabs.on("ready", function(tab) {

  worker = tab.attach({
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


                        self.data.url("./js/init.js")
                      ]
  });

  worker.port.emit("open", simplePrefs.prefs);
  worker.port.emit("activate", tabs.activeTab.url);

});

tabs.on("activate", function(tab){
  worker.port.emit("activate", tabs.activeTab.url);
});

tabs.on("deactivate", function(tab){
  worker.port.emit("deactivate", tabs.activeTab.url);
});

function onPrefChange(prefName){
  worker.port.emit("restart", simplePrefs.prefs);
}

simplePrefs.on("", onPrefChange);


tabs.open("http://stackoverflow.com");