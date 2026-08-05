const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

const dbPath = path.join(app.getPath('userData'), 'daily_cash_db.json');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "الإدارة المالية برو",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    // فحص التحديثات من مستودع majdmereee/dafaat في الخلفية
    autoUpdater.checkForUpdatesAndNotify().catch(() => {
        console.log("التطبيق يعمل في وضع الأوفلاين.");
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ==========================================
// إدارة قاعدة البيانات (قراءة وحفظ)
// ==========================================
ipcMain.handle('get-db', () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {}
    return null; 
});

ipcMain.handle('save-db', (event, data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) { 
        return false; 
    }
});
