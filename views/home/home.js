const {ipcRenderer} = require('electron');

function generateTableRow(tableId, tableData){
    const tbodyElement = $(tableId);
    tableData.forEach((rowData) => {
        const tr = $('<tr class="table-light">');
        tr.append('<th scope="row">' + rowData.id + '</th>');
        tr.append('<td>' + rowData.label +'</td>');
        tr.append('<td>' + rowData.value + ' €</td>');
        tr.append('<td>' +
            '<button class="btn btn-outline-warning mr-2">Modifier</button>' +
            '<button class="btn btn-outline-danger">Supprimer </button>' +
            '</td>'
        );

        tbodyElement.append(tr)
    });
}

function updateBalanceSheet(newBalanceSheet){
    const balanceSheetElement = $('#balanceSheet');

    balanceSheetElement.removeClass('bg-success bg-danger');
    balanceSheetElement.text(newBalanceSheet + ' €');

    if (newBalanceSheet > 0) {
        balanceSheetElement.addClass('bg-success');
    }
    else if (newBalanceSheet < 0){
        balanceSheetElement.addClass('bg-danger');
    }
}

ipcRenderer.on('store-data', (evt, data) => {
    console.log(data.expensesData);
    console.log(data.incomesData);
    generateTableRow('#expensesTbody', data.expensesData);
    generateTableRow('#incomesTbody', data.incomesData);
    updateBalanceSheet(data.balanceSheet);
});