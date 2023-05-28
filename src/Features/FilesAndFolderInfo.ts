import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ExaminationType from "../web/StartScreen/ExaminationType";

interface GlobalFilesAndFolderInfo {
    ownAnswerPath: string,
    modelAnswerPath: string,
    uploadFileOrFolderType: typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"] | null,
}
const globalFilesAndFolderInfo: GlobalFilesAndFolderInfo = {
    ownAnswerPath: "",
    modelAnswerPath: "",
    uploadFileOrFolderType: null
};

const globalFilesAndFolderInfoSlice = createSlice({
    name: "globalFilesAndFolderUpdate",
    initialState: globalFilesAndFolderInfo,
    reducers: {
        setOwnAnswerPath(state, action: PayloadAction<[string, typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"] | null]>) {
            // 自分の回答の時に どの種類のデータをアップロードしたか記録するために配列を使う
            state.ownAnswerPath = action.payload[0];
            state.uploadFileOrFolderType = action.payload[1];
        },
        setModelAnswerPath(state, action: PayloadAction<string>) {
            state.modelAnswerPath = action.payload;
        },
        resetPath(state) {
            state.ownAnswerPath = "";
            state.modelAnswerPath = "";
        }
    }
})

export const { setOwnAnswerPath, setModelAnswerPath, resetPath } = globalFilesAndFolderInfoSlice.actions;
export default globalFilesAndFolderInfoSlice.reducer;