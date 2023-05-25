console.log("preloaded!");

import { ipcRenderer, contextBridge } from 'electron'

// IPC メッセージ(のチャンネル) 登録
// main 以外から呼び出す window に含まれる オブジェクト名
contextBridge.exposeInMainWorld("FileAndFolderSelect", {// チャンネル名
    // exposeInMainWorld(`word`) の オブジェクト
    openDialog: (uploadType: "File" | "Dir") => ipcRenderer.invoke("FileAndFolderSelect", uploadType),
    // 関数の登録
});

contextBridge.exposeInMainWorld("NavigationOperator", {
    goBack: () => ipcRenderer.invoke("NavigationOperator", "goBack"),
})

contextBridge.exposeInMainWorld("scoringApps", {
    test: async (arg: any) => {
        const result = await ipcRenderer.invoke("scoringApps", arg);
        console.log(arg, result, "[preload]");
    }
})