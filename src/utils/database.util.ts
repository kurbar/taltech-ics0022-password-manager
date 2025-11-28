import path from 'path';
import crypto from 'crypto';
import electron from 'electron';
import {
  Expose,
} from 'class-transformer';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { machineIdSync } from 'node-machine-id';

export const DEFAULT_DATABASE_FILENAME = 'database';
export const MIGRATION_LOCK_DATABASE_FILENAME = 'migration-lock-database';
export const APPLICATION_DATABASE_FILE_EXTENSION = 'pmdb';
export const MIGRATION_DATABASE_FILE_EXTENSION = 'sqlite';
export const DEVELOPMENT_DATABASE_ENCRYPTION_KEY = 'development-secret';

// TODO: remove
const mockIsSafeStorageAvailable = false;

export function getDefaultDatabasePath(): string {
  if (electron?.app) {
    return getApplicationDatabasePath();
  } else {
    return getMigrationDatabasePath();
  }
}

export function getDatabaseEncryptionKey(bytes?: Buffer): string {
  if (electron?.app?.isPackaged && bytes) {
    return getDecryptedDatabaseKey(bytes);
  } else {
    return DEVELOPMENT_DATABASE_ENCRYPTION_KEY;
  }
}

export function encryptDatabaseKey(): Buffer {
  if (
    /* electron.safeStorage.isEncryptionAvailable() */ mockIsSafeStorageAvailable
  ) {
    const machineKey = machineIdSync();
    return electron.safeStorage.encryptString(machineKey);
  } else {
    // TODO: how to handle use-case when safe storage is not available, replace placeholder implementation
    return crypto
      .createHash('sha256')
      .update(DEVELOPMENT_DATABASE_ENCRYPTION_KEY)
      .digest();
  }
}

export function decryptDatabaseKey(bytes: Buffer): string {
  return electron.safeStorage.decryptString(bytes);
}

function getDecryptedDatabaseKey(bytes: Buffer): string {
  if (
    /* electron.safeStorage.isEncryptionAvailable() */ mockIsSafeStorageAvailable
  ) {
    return decryptDatabaseKey(bytes);
  } else {
    // TODO: how to handle use-case when safe storage is not available
    return DEVELOPMENT_DATABASE_ENCRYPTION_KEY;
  }
}

export class MetadataColumns {
  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'createdAt', toPlainOnly: true })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({ name: 'updatedAt', toPlainOnly: true })
  updated_at: Date;
}

function getApplicationDatabasePath() {
  // Use userData which is the proper location for app data
  // Cross-platform paths:
  // - macOS: ~/Library/Application Support/password-manager
  // - Windows: %APPDATA%/password-manager
  // - Linux: ~/.config/password-manager
  const userDataPath = electron.app.getPath('userData');
  const fileName = getApplicationDefaultDatabaseFilename();
  return path.join(userDataPath, fileName);
}

function getMigrationDatabasePath() {
  return [
    MIGRATION_LOCK_DATABASE_FILENAME,
    MIGRATION_DATABASE_FILE_EXTENSION,
  ].join('.');
}

function getApplicationDefaultDatabaseFilename(): string {
  return [DEFAULT_DATABASE_FILENAME, APPLICATION_DATABASE_FILE_EXTENSION].join(
    '.',
  );
}
