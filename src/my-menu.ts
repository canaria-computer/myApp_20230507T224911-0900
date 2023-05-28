import { BrowserWindow, Menu } from "electron";



export class MyMenu {
    private readonly mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    createMenu(): void {
        const template: Electron.MenuItemConstructorOptions[] = [
            {
                label: "window",
                submenu: [
                    { role: "close", label: "ウィンドウを閉じる" }
                ]
            },
            {
                label: "画面表示",
                submenu: [
                    {
                        label: "画面拡大",
                        accelerator: "CmdOrCtrl+Plus, CmdOrCtrl+NumAdd",
                        click: () => {
                            const level = this.mainWindow.webContents.getZoomLevel();
                            this.mainWindow.webContents.setZoomLevel(level + 1);
                        },
                    },
                    {
                        label: "画面縮小",
                        accelerator: "CmdOrCtrl+-, CmdOrCtrl+numsub",
                        click: () => {
                            const level = this.mainWindow.webContents.getZoomLevel();
                            this.mainWindow.webContents.setZoomLevel(level - 1);
                        },
                    },
                    {
                        label: "拡大縮小率を戻す",
                        accelerator: "CmdOrCtrl+0 CmdOrCtrl+num0",
                        click: () => {
                            this.mainWindow.webContents.setZoomLevel(0);
                        },
                    },
                ],
            },
        ];
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }
}