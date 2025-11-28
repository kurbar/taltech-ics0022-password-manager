// import { encryptDatabaseKey, getDatabaseEncryptionKey } from '@/utils/database.utils';
import { AppDataSource } from './dataSource';

import 'reflect-metadata';

export async function initializeDatabase(path?: string): Promise<void> {
  try {
    // const bytes = encryptDatabaseKey();
    await initializeDataSource(/* bytes, */ path);
    console.log('Data Source has been initialized!');
  } catch (error) {
    console.error('Error during Data Source initialization', error);
  }
}

export async function closeDatabaseConnection() {
  try {
    await AppDataSource.destroy();
    console.log('Current database connection has been closed');
  } catch (error) {
    console.error('Error during closing database connection', error);
  }
}

async function initializeDataSource(/* bytes: Buffer, */ path?: string): Promise<void> {
  // AppDataSource.setOptions({
  //   key: getDatabaseEncryptionKey(/* bytes */),
  // });
  if (path) {
    AppDataSource.setOptions({
      database: path,
    });
  }
  await AppDataSource.initialize();
}
