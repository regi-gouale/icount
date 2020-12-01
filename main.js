const { app, BrowserWindow, ipcMain } = require('electron');
const { data } = require('jquery');
var expenses = [
    {
        id: 1,
        label: "Achat huile moteur",
        value: 87
    },
    {
        id: 2,
        label: "Achat joint vidange",
        value: 32
    },
    {
        id: 3,
        label: "Achat filtre à huile",
        value: 23
    }
];
var incomes = [
    {
        id: 1,
        label: "Vidange voiture",
        value: 176
    }
];

let mainWindow = null;
let targetAddItemId = null; 

function generateBalanceSheet(incomes, expenses) {
    const sumIncomes = incomes.reduce((a, b) => a + (parseFloat(b.value) || 0), 0);
    const sumExpenses = expenses.reduce((a, b) => a + (parseFloat(b.value) || 0), 0);
    return sumIncomes - sumExpenses;
}

function createWindow(pathFile, width=1200, height=800 ) {
    let win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.loadFile(pathFile);

    win.on('closed', () => {
        win = null;
    });

    return win
}

app.whenReady().then(() => {
    mainWindow = createWindow('views/home/home.html');

    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.send('store-data', {
            expensesData: expenses, 
            incomesData: incomes,
            balanceSheet: generateBalanceSheet(incomes, expenses)
        });
    });
});

ipcMain.on('open-new-item-window', (evt, data) => {
    const win = createWindow('views/addItem/addItem.html', 500, 450);

    targetAddItemId = data;

    win.on('closed', () => {
        targetAddItemId = null;
    });
});

ipcMain.on('add-new-item', (evt, item) => {
    let newId = 1;
    let arrayForAdd = incomes; 
    if (targetAddItemId == 'addExpense'){
        arrayForAdd = expenses;
    }

    if (arrayForAdd.length > 0){
        newId = arrayForAdd[arrayForAdd.length - 1].id + 1;
    }

    item.id = newId;
    arrayForAdd.push(item);

    mainWindow.webContents.send('update-with-new-item', {
        item:[item],
        balanceSheet: generateBalanceSheet(incomes, expenses),
        target: targetAddItemId
    });
});

ipcMain.on('delete-item', (evt, data)=>{
    let arrayForDelete = incomes; 
    if (data.typeItem === 'Expense'){
        arrayForDelete = expenses;
    }

    for (let i=0; i<arrayForDelete.length; i++){
        if (arrayForDelete[i].id === data.id){
            arrayForDelete.splice(i, 1);
            break;
        }
    }
    data.balanceSheet = generateBalanceSheet(incomes, expenses);

    evt.sender.send('update-delete-item', data);
});


// * MENU CONFIGURATION 

