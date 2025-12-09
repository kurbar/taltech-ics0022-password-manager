import 'reflect-metadata';
import { app } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import {
  activateWindow,
  handleAllWindowsClosed,
} from '@/main/_config/window/window.handlers';
import { updateApplicationMenu } from '@/main/_config/menu/menu';
import { initializeApp } from './_config/init';
import { closeDatabaseConnection } from '@/database/database';
import './_config/controllers';

export interface EntryPoints {
  preloadEntry: string;
  windowEntry: string;
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string | undefined;

// Determine the correct window entry point
let windowEntry: string;
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  // Development mode
  windowEntry = MAIN_WINDOW_VITE_DEV_SERVER_URL;
  console.log('Using dev server URL:', windowEntry);
} else {
  // Production mode - construct path to built renderer
  const rendererName = MAIN_WINDOW_VITE_NAME || 'main_window';
  windowEntry = path.join(__dirname, `../renderer/${rendererName}/index.html`);
  console.log('Using production renderer path:', windowEntry);
  console.log('MAIN_WINDOW_VITE_NAME:', MAIN_WINDOW_VITE_NAME);
}

const entryPoints: EntryPoints = {
  preloadEntry: path.join(__dirname, 'preload.js'),
  windowEntry,
};

console.log('Entry points:', entryPoints);
console.log('__dirname:', __dirname);
console.log('Preload exists:', existsSync(entryPoints.preloadEntry));
console.log('Window entry exists:', existsSync(entryPoints.windowEntry));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => initializeApp(entryPoints));

app.on('window-all-closed', handleAllWindowsClosed);

app.on('activate', () => activateWindow(entryPoints));

// Auto-lock: Close database connection when app quits
app.on('before-quit', async () => {
  console.log('Application quitting - closing database connection (auto-lock)');
  await closeDatabaseConnection();
});

updateApplicationMenu();
