const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
let serverPort = 3333;

const { startServer } = require('./server.js');

async function init() {
  try {
    serverPort = await startServer();
  } catch (err) {
    console.error('Falha ao iniciar servidor:', err);
  }
  createWindow();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 820,
    minWidth: 700,
    minHeight: 700,
    title: 'NEXO SOUND',
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
  mainWindow.loadURL(`http://localhost:${serverPort}`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(init);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
