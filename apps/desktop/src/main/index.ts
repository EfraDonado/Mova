import { app, BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { join } from 'node:path';
import { registerIpcHandlers } from './ipc';
import { MovaDatabase } from './database';

const isDev = !app.isPackaged;

let mainWindow: BrowserWindow | null = null;
const database = new MovaDatabase();

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1520,
    height: 980,
    minWidth: 1200,
    minHeight: 820,
    backgroundColor: '#0B0D12',
    title: 'Mova',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 18 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    await mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  nativeTheme.themeSource = 'system';
  await database.initialize();
  registerIpcHandlers(ipcMain, database);
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow();
  }
});