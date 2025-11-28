import { app } from 'electron';
import path from 'path';
import { existsSync } from 'fs';
import {
  activateWindow,
  handleAllWindowsClosed,
} from '@/main/_config/window/window.handlers';
import { updateApplicationMenu } from '@/main/_config/menu/menu';
import { initializeApp } from './_config/init';
import './_config/controllers';

export interface EntryPoints {
  preloadEntry: string;
  windowEntry: string;
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const entryPoints: EntryPoints = {
  preloadEntry: path.join(__dirname, 'preload.js'),
  windowEntry:
    MAIN_WINDOW_VITE_DEV_SERVER_URL ??
    path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
};

console.log('Entry points:', entryPoints);
console.log('__dirname:', __dirname);
console.log('Preload exists:', existsSync(entryPoints.preloadEntry));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => initializeApp(entryPoints));

app.on('window-all-closed', handleAllWindowsClosed);

app.on('activate', () => activateWindow(entryPoints));

updateApplicationMenu();
