import {app} from 'electron';

export const appInfoService = {
  async getMetadata() {
    return {
      isDevelopmentEnv: !app.isPackaged,
    }
  }
} as const;
