import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GlobalFilesAndFolderInfo {
    ownAnswerPath: string,
    modelAnswerPath: string,
}
const globalFilesAndFolderInfo: GlobalFilesAndFolderInfo = {
    ownAnswerPath: "",
    modelAnswerPath: "",
};

const globalFilesAndFolderInfoSlice = createSlice({
    name: "globalFilesAndFolderUpdate",
    initialState: globalFilesAndFolderInfo,
    reducers: {
        setOwnAnswerPath(state, action: PayloadAction<string>) {
            state.ownAnswerPath = action.payload;
        },
        setModelAnswerPath(state, action: PayloadAction<string>) {
            state.modelAnswerPath = action.payload;
        }
    }
})

export const { setOwnAnswerPath, setModelAnswerPath } = globalFilesAndFolderInfoSlice.actions;
export default globalFilesAndFolderInfoSlice.reducer;