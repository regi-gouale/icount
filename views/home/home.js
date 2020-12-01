const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

function generateTableRow(tableId, tableData, typeItem) {
    const tbodyElement = $(tableId);
    tableData.forEach((rowData) => {
        const tr = $('<tr id="row' + typeItem + '_' + rowData.id + '" class="table-light">');
        tr.append('<th scope="row">' + rowData.id + '</th>');
        tr.append('<td>' + rowData.label + '</td>');
        tr.append('<td>' + rowData.value + ' €</td>');
        tr.append('<td>' +
            '<button id="modify' + typeItem + '_' + rowData.id + '" class="btn btn-outline-warning mr-2">Modifier</button>' +
            '<button id="delete' + typeItem + '_' + rowData.id + '" class="btn btn-outline-danger">Supprimer </button>' +
            '</td>'
        );

        tbodyElement.append(tr);

        const deleteBtn = $('#delete' + typeItem + '_' + rowData.id);
        deleteBtn.on('click', (evt) => {
            evt.preventDefault();

            console.log(rowData.id);
            dialog.showMessageBox({
                type: 'warning',
                buttons: ['Non', 'Oui'],
                title: 'Confirmation',
                message: 'Êtes vous sûr de vouloir supprimer cet élément ?'
            }).then(res => {
                if (res.response === 1) {
                    ipcRenderer.send('delete-item', { id: rowData.id, typeItem: typeItem });
                }
            }).catch(err => {
                console.log(err);
            });
            // ipcRenderer.send('delete');
        });
    });
};

function updateBalanceSheet(newBalanceSheet) {
    const balanceSheetElement = $('#balanceSheet');

    balanceSheetElement.removeClass('bg-success bg-danger');
    balanceSheetElement.text(newBalanceSheet + ' €');

    if (newBalanceSheet > 0) {
        balanceSheetElement.addClass('bg-success');
    }
    else if (newBalanceSheet < 0) {
        balanceSheetElement.addClass('bg-danger');
    }
};

const openWindowAddItem = (evt) => {
    ipcRenderer.send('open-new-item-window', evt.target.id);
};

$('#addExpense').on('click', openWindowAddItem);
$('#addIncome').on('click', openWindowAddItem);

ipcRenderer.on('store-data', (evt, data) => {
    generateTableRow('#expensesTbody', data.expensesData, 'Expense');
    generateTableRow('#incomesTbody', data.incomesData, 'Income');
    updateBalanceSheet(data.balanceSheet);
});

ipcRenderer.on('update-with-new-item', (evt, data) => {
    let tableId = '#expensesTbody';
    let typeItem = 'Expense';
    if (data.target === 'addIncome') {
        tableId = '#incomesTbody';
        typeItem = 'Income';
    }
    generateTableRow(tableId, data.item, typeItem);
    updateBalanceSheet(data.balanceSheet);
});

ipcRenderer.on('update-delete-item', (evt, data) => {
    $('#row' + data.typeItem + '_' + data.id).remove();
    updateBalanceSheet(data.balanceSheet);
});