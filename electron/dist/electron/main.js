"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_1 = require("./../src/environments/environment");
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1280,
        height: 720
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../../dist/test/index.html"),
        protocol: 'file:',
        slashes: true,
    }));
    if (environment_1.environment.production) {
        win.setMenu(null);
    }
    win.on('closed', function () {
        win = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
//# sourceMappingURL=main.js.map