/**
 * Shared database channel action constants
 * Used by both main and preload processes
 */
export enum DatabaseChannelAction {
  INITIALIZE_WITH_PASSWORD = 'database:initialize-with-password',
  VERIFY_PASSWORD = 'database:verify-password',
  IS_INITIALIZED = 'database:is-initialized',
  IS_CONNECTED = 'database:is-connected',
}

