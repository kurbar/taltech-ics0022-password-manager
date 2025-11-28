import { ipcRenderer } from 'electron';
import { DatabaseChannelAction } from '../../shared/database.constants';

const { INITIALIZE_WITH_PASSWORD, VERIFY_PASSWORD, IS_INITIALIZED, IS_CONNECTED } = DatabaseChannelAction;

const databaseChannel = {
  async initializeWithPassword(masterPassword: string): Promise<{ success: boolean; error?: string }> {
    return ipcRenderer.invoke(INITIALIZE_WITH_PASSWORD, masterPassword);
  },

  async verifyPassword(masterPassword: string): Promise<{ success: boolean; error?: string }> {
    return ipcRenderer.invoke(VERIFY_PASSWORD, masterPassword);
  },

  async isInitialized(): Promise<boolean> {
    return ipcRenderer.invoke(IS_INITIALIZED);
  },

  async isConnected(): Promise<boolean> {
    return ipcRenderer.invoke(IS_CONNECTED);
  },
} as const;

export default databaseChannel;

