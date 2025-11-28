import { contextBridge } from 'electron';
import appInfo from './app-info/app-info.channel';
import database from './database/database.channel';
import password from './password/password.channel';

console.log('Preload script is running');

const apiChannel = {
  appInfo,
  database,
  password,
}

export type Api = typeof apiChannel;

console.log('Exposing API to main world:', apiChannel);
contextBridge.exposeInMainWorld('api', apiChannel);
console.log('API exposed successfully');
