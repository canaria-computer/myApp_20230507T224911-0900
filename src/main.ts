import path from "path";
import { BrowserWindow, app, dialog, ipcMain } from "electron";
import { MyMenu } from "./my-menu";

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1250,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      nodeIntegration: false, //false is secure
      contextIsolation: true,//false is secure
      // contextIsolation: false,
      // nodeIntegration: true,
    },
  });

  const webFrame = mainWindow.webContents;
  mainWindow.loadFile("dist/index.html");
  webFrame.openDevTools({ mode: "right" });

  const myMenu = new MyMenu(mainWindow);
  myMenu.createMenu();

  ipcMain.handle("FileAndFolderSelect", async (_, uploadType: "File" | "Dir") => {
    return dialog
      .showOpenDialog(mainWindow, {
        properties: [
          ((uploadType === "File") ? "openFile" : "openDirectory")
        ],
        // buttonLabel: ""
        defaultPath: app.getPath("desktop")
      })
      .then((result) => {
        if (result.canceled) return "";
        return result.filePaths[0];
      });
  });
  ipcMain.handle("NavigationOperator", (_event, arg) => {
    webFrame.goBack();
  })
  // 採点システム呼び出しAPIを定義
  ipcMain.handle("scoringApps", (_event, arg) => {
    // バックエンド
    console.log(typeof arg, arg);
    return { message: "test" };
  })
});
app.once("window-all-closed", () => app.quit());
