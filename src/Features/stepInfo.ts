import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface StepInfoSteate {
    step: string[],
    activeStep: number,
}

const stepInfoSteate: StepInfoSteate = {
    step: [
        "試験と級を選ぶ",
        "規約に同意",
        "解答私案を選択",
        "模範解答を選択",
        "採点",
        "結果表示"
    ],
    activeStep: 0,
}

const stepInfoSteateSlice = createSlice({
    name: "StepInfoSteateUpdate",
    initialState: stepInfoSteate,
    reducers: {
        stepUp(state) {
            state.activeStep++
        },
        stepDown(state) {
            state.activeStep--
        },
        setStep(state, action: PayloadAction<number>) {
            state.activeStep = action.payload;
        }
    }
})

export const { stepUp, setStep, stepDown } = stepInfoSteateSlice.actions;
export default stepInfoSteateSlice.reducer;