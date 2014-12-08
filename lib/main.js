var buttons = require('sdk/ui/button/action');
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var pageWorker = require("sdk/page-worker");
//var connection = new WebSocket('ws://localhost:8888/ws');

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
  connection.send("Test send?!"); 
}

tabs.on("ready", function(tab) {
  /*worker = tab.attach({
    contentScriptFile: self.data.url("websockets.html"),
      contentScript: "console.log('content script');"
  });*/

  //worker.port.emit("alert", "Message from the add-on");
  _stickyInterface = pageWorker.Page({
    contentURL : self.data.url('websockets.html')
});
});

tabs.open("stackoverflow.com");