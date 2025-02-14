const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { handleDownload, forceQuitDownload } = require('./ipc/downloadHandler');
const { handlePathChange } = require('./ipc/pathChangeHandler');
const { handleYtdlpCheck } = require('./ipc/checkHandler');
const { searchVideo } = require('./ipc/searchVideo');
const { open } = require('./ipc/openHandler');
const { checkDataPath } = require('./utils/dataStore.js');

checkDataPath();

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    autoHideMenuBar: true,
    icon: './assets/icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('./src/views/index.html');
};

ipcMain.on('input-value', handleDownload);
ipcMain.on('search', searchVideo);
ipcMain.on('force-quit', forceQuitDownload);
ipcMain.on('changePath', handlePathChange);
ipcMain.on('start', handleYtdlpCheck);
ipcMain.on('open', open);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
