import { ipcMain, app } from 'electron';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { DatabaseChannelAction } from '@/shared/database.constants';
import { AppDataSource } from '@/database/dataSource';

const { INITIALIZE_WITH_PASSWORD, VERIFY_PASSWORD, IS_INITIALIZED, IS_CONNECTED } = DatabaseChannelAction;

console.log('Database controller loaded - registering IPC handlers');
console.log('Handler channels:', { INITIALIZE_WITH_PASSWORD, VERIFY_PASSWORD, IS_INITIALIZED, IS_CONNECTED });

// Config file to store encrypted master password hash and salt
const CONFIG_FILE_NAME = 'secure-config.json';
const getConfigPath = () => path.join(app.getPath('userData'), CONFIG_FILE_NAME);

interface SecureConfig {
  masterPasswordHash: string;
  encryptionSalt: string;
}

function loadConfig(): SecureConfig | null {
  try {
    const configPath = getConfigPath();
    if (!fs.existsSync(configPath)) {
      return null;
    }
    const data = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load config:', error);
    return null;
  }
}

function saveConfig(config: SecureConfig): void {
  try {
    const configPath = getConfigPath();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save config:', error);
    throw error;
  }
}

const PBKDF2_ITERATIONS = 600000;

// Rate limiting
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
let failedAttempts = 0;
let lockoutUntil: number | null = null;

/**
 * Check if account is locked due to too many failed attempts
 */
function isAccountLocked(): boolean {
  if (lockoutUntil && Date.now() < lockoutUntil) {
    return true;
  }
  if (lockoutUntil && Date.now() >= lockoutUntil) {
    // Lockout period expired, reset
    lockoutUntil = null;
    failedAttempts = 0;
  }
  return false;
}

/**
 * Record a failed login attempt and check if account should be locked
 */
function recordFailedAttempt(): void {
  failedAttempts++;
  if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
    lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    console.warn(`Account locked due to ${failedAttempts} failed attempts. Locked until ${new Date(lockoutUntil).toISOString()}`);
  }
}

/**
 * Reset failed attempts counter on successful login
 */
function resetFailedAttempts(): void {
  failedAttempts = 0;
  lockoutUntil = null;
}

/**
 * Derives a database encryption key from the master password using PBKDF2
 */
function deriveDatabaseKey(masterPassword: string, salt: string): string {
  return crypto.pbkdf2Sync(masterPassword, salt, PBKDF2_ITERATIONS, 32, 'sha256').toString('hex');
}

/**
 * Hashes the master password for verification purposes
 */
function hashMasterPassword(masterPassword: string, salt: string): string {
  return crypto.pbkdf2Sync(masterPassword, salt, PBKDF2_ITERATIONS, 64, 'sha512').toString('hex');
}

/**
 * Validate master password meets security requirements
 */
function validateMasterPassword(password: string): { valid: boolean; error?: string } {
  // Type check
  if (typeof password !== 'string') {
    return { valid: false, error: 'Password must be a string' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Master password must be at least 12 characters' };
  }

  // Maximum length to prevent DoS
  if (password.length > 128) {
    return { valid: false, error: 'Master password must be less than 128 characters' };
  }

  // Complexity requirements
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
    return { valid: false, error: 'Password must contain uppercase, lowercase, number, and special character' };
  }

  return { valid: true };
}

/**
 * Initialize the database with a master password
 */
console.log('Registering handler:', INITIALIZE_WITH_PASSWORD);
ipcMain.handle(INITIALIZE_WITH_PASSWORD, async (_event, masterPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Initializing database with master password...');

    // Check if already initialized
    const existingConfig = loadConfig();
    if (existingConfig) {
      return { success: false, error: 'Database is already initialized' };
    }

    // Validate password
    const validation = validateMasterPassword(masterPassword);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate a random salt for this database
    const salt = crypto.randomBytes(32).toString('hex');

    // Hash the master password for verification
    const passwordHash = hashMasterPassword(masterPassword, salt);

    // Derive the actual database encryption key
    const databaseKey = deriveDatabaseKey(masterPassword, salt);

    // Store the hash and salt securely
    saveConfig({
      masterPasswordHash: passwordHash,
      encryptionSalt: salt,
    });

    // Only log in development mode
    if (!app.isPackaged) {
      console.log('Master password hash and salt stored');
    }

    // Ensure the userData directory exists
    const userDataPath = app.getPath('userData');
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }

    // Get the database path and remove any existing database file
    // This is necessary because we're creating a NEW encrypted database
    const dbPath = path.join(userDataPath, 'database.pmdb');
    if (fs.existsSync(dbPath)) {
      console.log('Removing existing database file to create new encrypted database');
      fs.unlinkSync(dbPath);
    }

    // Initialize the database with SQLCipher encryption
    if (!AppDataSource.isInitialized) {
      AppDataSource.setOptions({
        key: databaseKey,
        prepareDatabase: (db: any) => {
          // Configure SQLCipher
          db.pragma(`cipher='sqlcipher'`);
          db.pragma(`key='${databaseKey}'`);
          db.pragma(`cipher_page_size=4096`);
          db.pragma(`kdf_iter=64000`);
          db.pragma(`cipher_hmac_algorithm=HMAC_SHA512`);
          db.pragma(`cipher_kdf_algorithm=PBKDF2_HMAC_SHA512`);
        },
      });

      await AppDataSource.initialize();
      console.log('Database initialized with SQLCipher encryption');
    } else {
      console.log('Database is already initialized');
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
});

/**
 * Verify a master password and unlock the database
 */
console.log('Registering handler:', VERIFY_PASSWORD);
ipcMain.handle(VERIFY_PASSWORD, async (_event, masterPassword: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if account is locked due to too many failed attempts
    if (isAccountLocked()) {
      const remainingTime = lockoutUntil ? Math.ceil((lockoutUntil - Date.now()) / 1000 / 60) : 0;
      console.warn('Login attempt blocked - account is locked');
      return {
        success: false,
        error: `Too many failed attempts. Please try again in ${remainingTime} minutes.`
      };
    }

    console.log('Verifying master password...');

    const config = loadConfig();
    if (!config) {
      return { success: false, error: 'Database is not initialized' };
    }

    const { masterPasswordHash: storedHash, encryptionSalt: salt } = config;

    // Hash the provided password with the stored salt
    const providedHash = hashMasterPassword(masterPassword, salt);

    // Compare hashes using timing-safe comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );

    if (!isValid) {
      recordFailedAttempt();
      console.warn(`Incorrect password attempt. Failed attempts: ${failedAttempts}/${MAX_LOGIN_ATTEMPTS}`);
      return { success: false, error: 'Incorrect master password' };
    }

    // Password is correct - reset failed attempts
    resetFailedAttempts();

    // Derive the database key
    const databaseKey = deriveDatabaseKey(masterPassword, salt);

    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.pmdb');
    console.log('Attempting to unlock database at:', dbPath);

    // Initialize the database connection with the correct key
    if (!AppDataSource.isInitialized) {
      AppDataSource.setOptions({
        key: databaseKey,
        prepareDatabase: (db: any) => {
          // Configure SQLCipher
          db.pragma(`cipher='sqlcipher'`);
          db.pragma(`key='${databaseKey}'`);
          db.pragma(`cipher_page_size=4096`);
          db.pragma(`kdf_iter=64000`);
          db.pragma(`cipher_hmac_algorithm=HMAC_SHA512`);
          db.pragma(`cipher_kdf_algorithm=PBKDF2_HMAC_SHA512`);
        },
      });

      await AppDataSource.initialize();
      console.log('Database unlocked successfully');
    } else {
      console.log('Database is already unlocked and connected');
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to verify password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unlock database'
    };
  }
});

/**
 * Check if the database has been initialized with a master password
 */
console.log('Registering handler:', IS_INITIALIZED);
ipcMain.handle(IS_INITIALIZED, async (): Promise<boolean> => {
  const config = loadConfig();
  return config !== null && !!config.masterPasswordHash && !!config.encryptionSalt;
});

/**
 * Check if the database connection is currently active
 */
console.log('Registering handler:', IS_CONNECTED);
ipcMain.handle(IS_CONNECTED, async (): Promise<boolean> => {
  return AppDataSource.isInitialized;
});

