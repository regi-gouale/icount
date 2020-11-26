const {app, BrowserWindow, ipcMain} = require('electron');

function createWindow(){
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('views/home/home.html');

    win.on('closed', () => {
        win = null;
    });

    return win
}

app.whenReady().then(createWindow);


ipcMain.on('getNewTitle', (evt, arg) => {
    evt.sender.send('giveNewTitle', 'De nouveau, bonjour je vous fais les comptes !');
});