import { app, BrowserWindow } from 'electron';
import { EntryPoints } from '@/main';
import { AppInfoChannelAction } from '@/preload/app-info/app-info.channel';
import { isMacOS } from '@/utils/electron.util';

export function createWindow({ preloadEntry, windowEntry }: EntryPoints): void {
  console.log('Creating window with preload:', preloadEntry);
  console.log('Creating window with entry:', windowEntry);

  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: preloadEntry,
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
    },
    show: false,
  });
  // Enable experimental web platform features for the webpage - only necessary for debugging
  // app.commandLine.appendSwitch('enable-experimental-web-platform-features');

  // Convert path to proper file:// URL if it's not already a URL
  const urlToLoad = windowEntry.startsWith('http')
    ? windowEntry
    : `file://${windowEntry}`;

  console.log('Loading URL:', urlToLoad);

  mainWindow.loadURL(urlToLoad).then(() => {
    console.log('Window URL loaded successfully');
  }).catch((err) => {
    console.error('Failed to load window URL:', err);
  });

  console.log('Window loading URL...');

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
  setContentSecurityPolicyHeader(mainWindow);
  showOnceContentHasLoadedAndColorSchemeInitialized(mainWindow);
  console.log('Window creation initiated');
}

function showOnceContentHasLoadedAndColorSchemeInitialized(mainWindow: BrowserWindow) {
  let hasShown = false;

  mainWindow.webContents.ipc.once(AppInfoChannelAction.READY_TO_SHOW_WINDOW, () => {
    console.log('Received READY_TO_SHOW_WINDOW event');
    if (!hasShown) {
      hasShown = true;
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Log any console messages from renderer for debugging
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer ${level}]:`, message, sourceId ? `(${sourceId}:${line})` : '');
  });

  // Log errors from renderer
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Render process gone:', details);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.error('Window became unresponsive');
  });

  // Fallback: show window after 3 seconds if IPC event doesn't fire
  setTimeout(() => {
    if (!hasShown) {
      console.log('Fallback: showing window after timeout (renderer may have failed to initialize properly)');
      hasShown = true;
      mainWindow.show();
      mainWindow.focus();
    }
  }, 3000);

  // Also show on did-finish-load as additional fallback
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window finished loading HTML');
  });

  // Track failed loads
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
  });
}

function setContentSecurityPolicyHeader(mainWindow: BrowserWindow) {
  // Note: 'unsafe-inline' for styles is kept for Tailwind compatibility
  // 'unsafe-eval' for script-src may be needed for development but should be avoided in production
  const isPackaged = app.isPackaged;

  const CSP = [
    "default-src 'self'",
    // For production builds, we need to allow inline scripts from Vite build
    `script-src 'self' ${isPackaged ? "'unsafe-inline'" : ""}`,
    "worker-src 'self' blob:",
    "connect-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'", // TODO: Replace with nonce for production
    "font-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Remove upgrade-insecure-requests for file:// protocol in packaged app
    ...(isPackaged ? [] : ["upgrade-insecure-requests"])
  ].join('; ');

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [CSP],
        'X-Frame-Options': ['DENY'],
        'X-Content-Type-Options': ['nosniff'],
        'X-XSS-Protection': ['1; mode=block'],
        'Referrer-Policy': ['no-referrer'],
        'Permissions-Policy': ['geolocation=(), microphone=(), camera=()'],
        // Remove server fingerprinting
        'X-Powered-By': [''],
      },
    });
  });
}

export function activateWindow(entryPoints: EntryPoints) {
  // On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(entryPoints);
  }
}

export function handleAllWindowsClosed() {
  // Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
  if (!isMacOS) {
    app.quit();
  }
}
