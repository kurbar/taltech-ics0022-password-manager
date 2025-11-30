import betterSqlite3 from 'better-sqlite3-multiple-ciphers';
import { DataSource } from 'typeorm';

import { getDefaultDatabasePath } from '@/utils/database.util';
import { PasswordEntity } from '@/main/manager/entities/password.entity';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  driver: betterSqlite3,
  database: getDefaultDatabasePath(),
  // Key will be set dynamically when initializing with master password
  entities: [
    PasswordEntity,
  ],
  migrations: [],
  migrationsRun: true,
  synchronize: true, // Enable synchronize to create tables automatically
  logging: true,
  // prepareDatabase will be set dynamically when initializing with master password
});
