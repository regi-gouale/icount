const { app, BrowserWindow, ipcMain } = require('electron');
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
        value: 142
    }
];

function generateBalanceSheet(incomes, expenses) {
    const sumIncomes = incomes.reduce((a, b) => a + (parseFloat(b.value) || 0), 0);
    const sumExpenses = expenses.reduce((a, b) => a + (parseFloat(b.value) || 0), 0);
    return sumIncomes - sumExpenses;
}

function createWindow() {
    let win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('views/home/home.html');

    win.webContents.once('did-finish-load', () => {
        win.send('store-data', {
            expensesData: expenses, 
            incomesData: incomes,
            balanceSheet: generateBalanceSheet(incomes, expenses)
        });
    });

    win.on('closed', () => {
        win = null;
    });

    return win
}

app.whenReady().then(createWindow);


ipcMain.on('getNewTitle', (evt, arg) => {
    evt.sender.send('giveNewTitle', 'De nouveau, bonjour je vous fais les comptes !');
});