const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// تحديد مسار آمن جداً لحفظ بيانات الصندوق بعيداً عن ملفات البرنامج لتجنب الحذف
const dbPath = path.join(app.getPath('userData'), 'daily_cash_db.json');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "الصندوق اليومي - مطعمي برو",
        // إذا أردت وضع أيقونة للبرنامج، يمكنك إزالة التعليق عن السطر التالي وتوفير ملف icon.ico
        // icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true, // السماح لـ index.html باستخدام دوال النظام
            contextIsolation: false // تعطيل العزل ليعمل الكود الخاص بنا مباشرة
        }
    });

    // إخفاء شريط القوائم العلوي (File, Edit, View...) ليعطي إحساس التطبيقات الاحترافية
    mainWindow.setMenuBarVisibility(false);

    // تحميل واجهة المستخدم
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// ========================================================
// دوال الاتصال بقاعدة البيانات (IPC Handlers)
// ========================================================

// دالة جلب البيانات عند فتح التطبيق
ipcMain.handle('get-db', () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("خطأ في قراءة قاعدة البيانات:", error);
    }
    return null; 
});

// دالة حفظ البيانات فوراً عند أي تعديل
ipcMain.handle('save-db', (event, data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error("خطأ في حفظ قاعدة البيانات:", error);
        return false;
    }
});
