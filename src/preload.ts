console.log("preloaded!");

import { ipcRenderer, contextBridge } from 'electron'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

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
    },
    scoreringInstantiation: async (ownAnsPath: string, modelAnsPath: string) => {
        const result = await ipcRenderer.invoke("scoringApps", ownAnsPath, modelAnsPath);
        // await sleep(1000 * (Math.random() * (10 - 0 + 1) + 0)); // TODO 調整
        // await sleep(1000 * 10); // TODO 調整
        await sleep(1000 * 1); // TODO 調整
        return result;
    }
})

contextBridge.exposeInMainWorld("appExit", {
    exit: async () => {
        await ipcRenderer.invoke("appExit");
    }
})