const { app, BrowserWindow, shell, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

// Register custom scheme 'app' before app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
]);

let mainWindow;

function getOutPath() {
  // app.getAppPath() points to the project root in dev, and resources/app.asar in production.
  return path.join(app.getAppPath(), 'out');
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.svg') return 'image/svg+xml; charset=utf-8';
  if (ext === '.ico') return 'image/x-icon';
  if (ext === '.woff') return 'font/woff';
  if (ext === '.woff2') return 'font/woff2';
  if (ext === '.ttf') return 'font/ttf';
  return 'application/octet-stream';
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Veritas AI',
    icon: path.join(app.getAppPath(), 'public', 'favicon.ico'),
    backgroundColor: '#0f1117',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false,
    titleBarStyle: 'default',
  });

  // Load the application using the custom protocol
  mainWindow.loadURL('app://local/index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Handle custom 'app://' protocol to load Next.js static files correctly
  protocol.handle('app', async (request) => {
    try {
      const url = new URL(request.url);
      let pathname = decodeURIComponent(url.pathname);
      
      if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
      }

      const outPath = getOutPath();
      let filePath = path.join(outPath, pathname);

      // Support Next.js clean URLs (e.g. /login -> /login.html)
      if (!fs.existsSync(filePath)) {
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) {
          filePath = htmlPath;
        } else {
          // Fallback to index.html for client-side routing
          filePath = path.join(outPath, 'index.html');
        }
      }

      // Read file content from local disk
      const data = fs.readFileSync(filePath);
      const mimeType = getMimeType(filePath);

      return new Response(data, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.error('Custom Protocol Error:', error);
      return new Response(`File error: ${error.message}`, { status: 404 });
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
