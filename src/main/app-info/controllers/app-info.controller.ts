import {ipcMain} from 'electron';
import {AppInfoChannelAction} from "@/preload/app-info/app-info.channel";
import {AppMetadata} from "@/main/app-info/dto/app-metadata.dto";
import {appInfoService} from "@/main/app-info/services/app-info.service";

const {GET_METADATA} = AppInfoChannelAction;

ipcMain.handle(GET_METADATA, async (): Promise<AppMetadata> => {
  return appInfoService.getMetadata();
})
