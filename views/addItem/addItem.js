const {ipcRenderer} = require('electron');

$('#addItem').on('submit', (evt) => {
    evt.preventDefault();
    const newItem = $('#addItem').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj
    }, {});

    ipcRenderer.send('add-new-item', newItem);
    $('#addItem')[0].reset();
}); 