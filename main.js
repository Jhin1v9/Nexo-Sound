const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// Inicia o servidor Express dentro do processo principal
require('./server.js');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 820,
    minWidth: 700,
    minHeight: 700,
    title: 'Volume Boost 500%',
    icon: path.join(__dirname, 'public', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false,
    frame: true,
    backgroundColor: '#080808'
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL('http://localhost:3333');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // aguarda servidor subir
  setTimeout(createWindow, 800);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
