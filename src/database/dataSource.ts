import betterSqlite3 from 'better-sqlite3-multiple-ciphers';
import { DataSource } from 'typeorm';

/* For now, imports in this file should be relative so that typeorm migration script works */
import { getDefaultDatabasePath } from '@/utils/database.util';
import { PasswordEntity } from '../main/manager/entities/password.entity';

// import { SubjectPersonEntity } from '../main/subject/entities/subject-person.entity';
// import { SetEntity } from '../main/set/entities/set.entity';
// import { SetObjectProfileEntity } from '../main/set/entities/set-object-profile';
// import { ObjectEntity } from '../main/object/entities/object.entity';
// import { SyncStatusEntity } from '../main/sync/entities/sync-status.entity';
// import { LastSyncTimeEntity } from '../main/sync/entities/last-sync-time.entity';
// import { MeasurementEntity } from '../main/measurement/entities/measurement.entity';
//
// import { AddSubjectPersonTable1740559771351 as AddSubjectPersonTable } from './migrations/1740559771351-AddSubjectPersonTable';
// import { AddSetTable1741687254970 as AddSetTable } from './migrations/1741687254970-AddSetTable';
// import { AddObjectTableWithDefaultObjects1741943503243 as AddObjectTableWithDefaultObjects } from './migrations/1741943503243-AddObjectTableWithDefaultObjects';
// import { AddSetObjectProfileTable1742826647744 as AddSetObjectProfileTable } from './migrations/1742826647744-AddSetObjectProfileTable';
// import { AddSyncStatusTable1749836530767 as AddSyncStatusTable } from './migrations/1749836530767-AddSyncStatusTable';
// import { AddMeasurementAndLastSyncTimeTables1756646104880 as AddMeasurementAndLastSyncTimeTables } from './migrations/1756646104880-AddMeasurementAndLastSyncTimeTables';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  driver: betterSqlite3,
  database: getDefaultDatabasePath(),
  // Key will be set dynamically when initializing with master password
  entities: [
    PasswordEntity,
    // SubjectPersonEntity,
    // SetEntity,
    // ObjectEntity,
    // SetObjectProfileEntity,
    // SyncStatusEntity,
    // LastSyncTimeEntity,
    // MeasurementEntity,
  ],
  migrations: [
    // AddSubjectPersonTable,
    // AddSetTable,
    // AddObjectTableWithDefaultObjects,
    // AddSetObjectProfileTable,
    // AddSyncStatusTable,
    // AddMeasurementAndLastSyncTimeTables,
  ],
  migrationsRun: true,
  synchronize: true, // Enable synchronize to create tables automatically
  logging: true,
  // prepareDatabase will be set dynamically when initializing with master password
});
