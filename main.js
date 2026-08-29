const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function startServer() {
  serverProcess = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
    cwd: __dirname,
    stdio: 'ignore',
    windowsHide: true
  });
}

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
    // mainWindow.maximize();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (serverProcess) {
      serverProcess.kill();
      serverProcess = null;
    }
  });
}

app.whenReady().then(() => {
  startServer();
  // aguarda servidor subir
  setTimeout(createWindow, 1200);
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
