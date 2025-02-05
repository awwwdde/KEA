import { app, BrowserWindow } from 'electron';
import path from 'path';
import electronIsDev from 'electron-is-dev';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
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