import { app, BrowserWindow } from 'electron';
import path from 'path';
import electronIsDev from 'electron-is-dev';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 800,
    frame: true,
    resizable: false,
    transparent: true,
    title: 'KEA',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      webSecurity: true
    }
  });

  win.loadURL(
    electronIsDev
      ? 'http://localhost:3000'
      : `file://${path.join(process.cwd(), 'build/index.html')}`
  );

  if (electronIsDev) {
    win.webContents.openDevTools({ mode: 'right' });
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

});
process.env.ELECTRON_DISABLE_SYMLINKS = 'true';