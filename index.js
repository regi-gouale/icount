const {ipcRenderer} = require('electron');

$('#changeTitle').on('click', () => {
    ipcRenderer.send('getNewTitle', '');
});

ipcRenderer.on('giveNewTitle', (evt, data) => {
    $('h1').text(data);
});