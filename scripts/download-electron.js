/**
 * Downloads electron-v43.4.0-win32-x64.zip and places it in the
 * electron-builder cache so subsequent builds skip the download entirely.
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const VERSION = '43.4.0';
const PLATFORM = 'win32';
const ARCH = 'x64';
const FILENAME = `electron-v${VERSION}-${PLATFORM}-${ARCH}.zip`;

// electron-builder cache location on Windows
const CACHE_DIR = path.join(
  os.homedir(),
  '.cache',
  'electron-builder',
  'electron',
  VERSION
);
const DEST = path.join(CACHE_DIR, FILENAME);

const MIRRORS = [
  `https://npmmirror.com/mirrors/electron/v${VERSION}/${FILENAME}`,
  `https://github.com/electron/electron/releases/download/v${VERSION}/${FILENAME}`,
];

function download(url, dest, cb) {
  console.log(`Trying: ${url}`);
  const mod = url.startsWith('https') ? https : http;
  mod.get(url, { rejectUnauthorized: false }, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return download(res.headers.location, dest, cb);
    }
    if (res.statusCode !== 200) {
      return cb(new Error(`HTTP ${res.statusCode}`));
    }
    const total = parseInt(res.headers['content-length'] || '0', 10);
    let received = 0;
    const out = fs.createWriteStream(dest);
    res.on('data', (chunk) => {
      received += chunk.length;
      if (total) process.stdout.write(`\r  ${((received / total) * 100).toFixed(1)}%   `);
    });
    res.pipe(out);
    out.on('finish', () => { console.log('\n  Done!'); cb(null); });
    out.on('error', cb);
  }).on('error', cb);
}

function tryMirrors(mirrors, dest, idx, cb) {
  if (idx >= mirrors.length) return cb(new Error('All mirrors failed'));
  download(mirrors[idx], dest, (err) => {
    if (err) {
      console.error(`  Failed: ${err.message}`);
      tryMirrors(mirrors, dest, idx + 1, cb);
    } else {
      cb(null);
    }
  });
}

if (fs.existsSync(DEST)) {
  console.log(`Already cached at: ${DEST}`);
  process.exit(0);
}

fs.mkdirSync(CACHE_DIR, { recursive: true });
console.log(`Cache dir: ${CACHE_DIR}`);
tryMirrors(MIRRORS, DEST, 0, (err) => {
  if (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  }
  console.log(`Cached: ${DEST}`);
  console.log('\nNow run:  $env:ELECTRON_SKIP_DOWNLOAD="1"; npm run electron:build');
});
