import { isMacOS } from '@/utils/electron.util';
import { app, Menu, MenuItemConstructorOptions, shell } from 'electron';

function createApplicationMenuTemplate() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'common.menu.file.title',
      role: 'fileMenu',
    },
    {
      label: 'common.menu.edit.title',
      role: 'editMenu',
    },
    {
      label: 'common.menu.view.title',
      role: 'viewMenu',
    },
    {
      label: 'common.menu.window.title',
      role: 'windowMenu',
    },
    {
      label: 'common.menu.help.title',
      submenu: [
        {
          label: 'common.menu.help.submenu.learn',
          click: () => {
            shell.openExternal('https://myoton.com/quick-guide/');
          },
        },
      ],
    },
  ];
  if (isMacOS) {
    addMacOSAppMenu(template);
  }
  return template;
}

function addMacOSAppMenu(template: MenuItemConstructorOptions[]) {
  template.unshift({
    label: app.name,
    role: 'appMenu',
  });
}

export function updateApplicationMenu() {
  const template = createApplicationMenuTemplate();
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
