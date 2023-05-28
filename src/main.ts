import path from "path";
import { BrowserWindow, app, dialog, ipcMain } from "electron";
import { MyMenu } from "./my-menu";
import HomepageProducitonScoring from "./web/scoringApps/Homepage_Production/main";

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1250,
    icon: "src/components/icon/logo.png",
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
  // webFrame.openDevTools({ mode: "right" });

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
  ipcMain.handle("scoringApps", (_, ownAnsPath: string, modelAnsPath: string) => {
    // バックエンド
    console.log("[main]", ownAnsPath, modelAnsPath);
    // todo エラー補足必要
    // todo 結果などを成形して送り出す
    const instant = new HomepageProducitonScoring(ownAnsPath, modelAnsPath);
    const result = {
      score: instant.calScore(),
      failedComparHashValue: instant.failedComparHashValue,
      examinationTakerName: instant.getExaminationTakerName(),
      inspectionDataArray: instant.inspectionDataArray,
    }
    return result;
  })
  ipcMain.handle("appExit", async () => {
    const buttons = ["終了する", "終了しない(キャンセル)"]
    const res = await dialog.showMessageBox(mainWindow, {
      message: "アプリケーションを終了しますか。",
      type: "question",
      buttons: buttons,
      defaultId: 1,
      cancelId: 1,
      title: "終了確認",
    })
    const index = res.response
    if (index === 0) {
      app.exit();
    }
  })
});
app.once("window-all-closed", () => app.quit());
