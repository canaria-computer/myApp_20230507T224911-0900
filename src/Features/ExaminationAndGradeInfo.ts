import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import ExaminationType from "../web/StartScreen/ExaminationType";

interface ExaminationAndGradeInfoSteate {
    examination: typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"] | null
    grade: typeof ExaminationType.prototype.SUPPORT_GRADE_TABLE[typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"]][number] | null,
}

const examinationAndGradeInfoSteate: ExaminationAndGradeInfoSteate = {
    examination: null,
    grade: null,
}

const examinationAndGradeInfoSteateSlice = createSlice({
    name: "examinationAndGradeInfoSteateUpdate",
    initialState: examinationAndGradeInfoSteate,
    reducers: {
        setExamination(state, action: PayloadAction<typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"] | null>) {
            state.examination = action.payload;
        },
        setGrade(state, action: PayloadAction<typeof ExaminationType.prototype.SUPPORT_GRADE_TABLE[typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"]][number] | null>) {
            state.grade = action.payload;
        }
    }
})

export const { setExamination, setGrade } = examinationAndGradeInfoSteateSlice.actions;
export default examinationAndGradeInfoSteateSlice.reducer;