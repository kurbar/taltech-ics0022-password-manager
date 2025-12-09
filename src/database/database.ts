// import { encryptDatabaseKey, getDatabaseEncryptionKey } from '@/utils/database.utils';
import { AppDataSource } from './dataSource';

import 'reflect-metadata';

export async function closeDatabaseConnection() {
  try {
    if (!AppDataSource.isInitialized) {
      console.log('Database connection is not initialized, no need to close');
      return;
    }

    await AppDataSource.destroy();
    console.log('Current database connection has been closed');
  } catch (error) {
    console.error('Error during closing database connection', error);
  }
}
