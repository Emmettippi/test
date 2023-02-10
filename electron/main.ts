import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;

function createWindow() {
    win = new BrowserWindow({
        width: 1280,
        height: 720
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/../../dist/test/index.html`),
            protocol: 'file:',
            slashes: true,
        })
    );

    // win.setMenu(null);

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
