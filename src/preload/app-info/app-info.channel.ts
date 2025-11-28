import { ipcRenderer } from 'electron';
import { AppMetadata } from '@/main/app-info/dto/app-metadata.dto';

export enum AppInfoChannelAction {
  READY_TO_SHOW_WINDOW = 'ready-to-show-window',
  GET_METADATA = 'get-metadata',
}

const { READY_TO_SHOW_WINDOW, GET_METADATA } = AppInfoChannelAction;

const appInfoChannel = {
  async readyToShowWindow(): Promise<void> {
    return ipcRenderer.send(READY_TO_SHOW_WINDOW);
  },

  async getMetadata(): Promise<AppMetadata> {
    return ipcRenderer.invoke(GET_METADATA);
  },
} as const;

export default appInfoChannel;
