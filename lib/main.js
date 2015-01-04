var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var pageWorker = require("sdk/page-worker");
var simplePrefs = require('sdk/simple-prefs');

var worker;

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
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
    contentScriptFile: self.data.url("websockets.js"),
    contentScript: "console.log('content script');"
  });

  worker.port.emit("open", simplePrefs.prefs);
  
  /*_stickyInterface = pageWorker.Page({
    contentURL : self.data.url('websockets.html')
  });*/
});

function onPrefChange(prefName){
  console.log("The preference " + prefName + " value has changed!");
  worker.port.emit("restart", simplePrefs.prefs);
}

simplePrefs.on("", onPrefChange);


tabs.open("http://stackoverflow.com");