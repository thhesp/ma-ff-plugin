CommunicationExtension.init();

self.port.on("click", CommunicationExtension.onClick);
self.port.on("restart", CommunicationExtension.onRestart);
self.port.on("open", CommunicationExtension.onOpen);
self.port.on("close", CommunicationExtension.onClose);

self.port.on("activate", CommunicationExtension.onActivateTab);