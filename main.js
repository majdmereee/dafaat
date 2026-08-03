const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// تحديد مسار قاعدة البيانات بأمان تام داخل مجلد النظام الخاص بالمستخدم
const dbPath = path.join(app.getPath('userData'), 'daily_cash_db.json');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "الصندوق اليومي - مطعمي برو",
        autoHideMenuBar: true, // إخفاء القوائم العلوية بأمان
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

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
    } catch (error) {
        console.error("خطأ في قراءة البيانات:", error);
    }
    return null; 
});

ipcMain.handle('save-db', (event, data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("خطأ في حفظ البيانات:", error);
        return false;
    }
});
