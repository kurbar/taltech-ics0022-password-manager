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

  mainWindow.loadURL(windowEntry);

  console.log('Window loading URL...');

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
  setContentSecurityPolicyHeader(mainWindow);
  showOnceContentHasLoadedAndColorSchemeInitialized(mainWindow);
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

  // Fallback: show window after 3 seconds if IPC event doesn't fire
  setTimeout(() => {
    if (!hasShown) {
      console.log('Fallback: showing window after timeout');
      hasShown = true;
      mainWindow.show();
      mainWindow.focus();
    }
  }, 3000);

  // Also show on did-finish-load as additional fallback
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window finished loading');
  });
}

function setContentSecurityPolicyHeader(mainWindow: BrowserWindow) {
  // Note: 'unsafe-inline' for styles is kept for Tailwind compatibility
  // Consider moving to nonce-based approach in production
  const CSP = [
    "default-src 'self'",
    "script-src 'self'",
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
    "upgrade-insecure-requests"
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
