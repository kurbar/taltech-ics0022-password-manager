import {createWindow} from "@/main/_config/window/window.handlers";
import { EntryPoints } from "@/main";
import { initializeApplicationStore } from "@/main/_config/application-store/init";

export async function initializeApp(entryPoints: EntryPoints) {
  console.log('Starting app initialization...');
  initializeApplicationStore();

  // Note: Database will be initialized when the user sets/verifies their master password
  // via the database controller IPC handlers
  console.log('Skipping auto database initialization - waiting for master password');

  createWindow(entryPoints);
  console.log('Window creation initiated');
}
