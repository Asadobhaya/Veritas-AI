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

  // Load the application using the custom protocol or fallback if not yet built
  const outIndex = path.join(getOutPath(), 'index.html');
  if (fs.existsSync(outIndex)) {
    mainWindow.loadURL('app://local/index.html');
  } else {
    // If out/ is not yet built, check dev server or show friendly instructions
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      const fallbackHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Veritas AI</title>
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; background: #0f1117; color: #f8fafc; height: 100vh; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;">
          <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 32px 40px; max-width: 520px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h1 style="color: #818cf8; font-size: 24px; margin-top: 0; margin-bottom: 12px;">🛡️ Veritas AI Desktop</h1>
            <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
              Static build files were not found. Please compile the application assets first by running:
            </p>
            <div style="background: #0f172a; padding: 12px 20px; border-radius: 8px; font-family: monospace; font-size: 14px; color: #38bdf8; border: 1px solid #334155; margin-bottom: 20px;">
              npm run build
            </div>
            <p style="color: #64748b; font-size: 13px; margin: 0;">
              Alternatively, run <code>npm run dev</code> to preview in a web browser.
            </p>
          </div>
        </body>
        </html>
      `;
      mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(fallbackHtml));
    });
  }

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

      // Read file content from local disk if it exists
      if (!fs.existsSync(filePath)) {
        return new Response('File not found', { status: 404 });
      }

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
