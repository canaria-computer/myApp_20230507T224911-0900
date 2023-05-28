import { useEffect, useState } from "react"
import { Button, Grid, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Select from "react-select";
// import Select from "@mui/material/Select"
import ExaminationType from "./ExaminationType";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "..";
import { setStep, stepUp } from "../../Features/stepInfo";
import { setExamination, setGrade } from "../../Features/ExaminationAndGradeInfo";
import { resetPath } from "../../Features/FilesAndFolderInfo";

const examinationTypeOptions = new ExaminationType();

type ExaminationSelectedType = { isDisabled: Boolean, label: String, value: typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"] | null }


const Start = () => {
    // store からの情報
    const stepperInfo = useSelector((state: RootState) => state.stepper);
    const examAndGradeInfo = useSelector((state: RootState) => state.examinationGradeInfo);
    const fileAndFolderInfo = useSelector((state: RootState) => state.FilesAndFolderInfo);

    // stepperInfo のチェック
    useEffect(() => {
        if (stepperInfo.activeStep !== 0) {
            dispatch(setStep(0));
        }
    }, [])

    const [examinationSelected, setExaminationSelected] = useState<ExaminationSelectedType | null>((() => {
        // 前の状態から戻す
        const searchResult = examinationTypeOptions.EXAMINATION_LIST.filter(element => element.value === examAndGradeInfo.examination);
        if (searchResult.length === 0) return null;
        return searchResult[0];
    }));
    const [gradeSclected, setGradeSclected] = useState(() => {
        // 前の状態から戻す
        const result = { value: "", label: "" }
        if (examAndGradeInfo.examination !== null && examAndGradeInfo.grade !== null) {
            const supportGrade = examinationTypeOptions.getSupportGrade(examAndGradeInfo.examination);
            // @ts-ignore
            if (supportGrade.includes(examAndGradeInfo.grade)) {
                result.value = examAndGradeInfo.grade
                result.label = examinationTypeOptions.getGradeFullName(examAndGradeInfo.grade).JP_FormalName
            }
        }
        return result
    });

    const [gradeOption, setGradeOption] = useState(() => {
        if (examinationSelected !== null &&
            examinationSelected?.value !== undefined &&
            examinationSelected.value !== null
        ) {
            const supportGradeShortName = examinationTypeOptions.getSupportGrade(examinationSelected.value);
            const supportFullName = supportGradeShortName
                .map(shortName => examinationTypeOptions.getGradeFullName(shortName)["JP_FormalName"])
            const options = supportGradeShortName.map((shortName, index) => {
                const fullName = supportFullName[index];
                return { value: shortName, label: fullName }
            })
            return options;
        } else {
            return [{ value: "", label: "" }];
        }
    })// 選べる級
    const [gradeSclectedDisable, setGradeSclectedDisable] = useState(
        !(Boolean(examAndGradeInfo.examination) && Boolean(examAndGradeInfo.grade))
    );

    const [nextButtonDisable, setNextButtonDisable] = useState(
        !(Boolean(examAndGradeInfo.examination) && Boolean(examAndGradeInfo.grade) &&
            Boolean(gradeSclected.value) && Boolean(examinationSelected?.value))
    );

    const dispatch = useDispatch();

    const handleNextButtonClick = () => {
        if (
            examinationSelected?.value === undefined || examinationSelected.value === null ||
            gradeSclected?.value === undefined || gradeSclected.value === null || gradeSclected.value === ""
        ) {
            throw new Error();
        }

        // 選択済みのファイルがあるときに テストする 検定が変更されていた時
        if (examAndGradeInfo.examination !== fileAndFolderInfo.uploadFileOrFolderType) {
            dispatch(resetPath());
        }
        dispatch(setExamination(examinationSelected.value))
        dispatch(setGrade(gradeSclected.value as typeof ExaminationType.prototype.SUPPORT_GRADE_TABLE[typeof ExaminationType.prototype.EXAMINATION_LIST[number]["value"]][number] | null))
        dispatch(stepUp());
    }

    const handleSelectExaminationChange = (selectedOption: any) => {
        setExaminationSelected(selectedOption);
        // 有効化どうか
        const gradeSclectedDisable = examinationTypeOptions.EXAMINATION_LIST.some((obj) => obj.value === selectedOption);
        setGradeSclectedDisable(gradeSclectedDisable)
        // 選択に応じて級を変更できるようにする
        const selectExamination = selectedOption.value; // 現在の選択値を得る
        const supportGradeShortName = examinationTypeOptions.getSupportGrade(selectExamination);
        const supportFullName = supportGradeShortName
            .map(shortName => examinationTypeOptions.getGradeFullName(shortName)["JP_FormalName"]);
        const options = supportGradeShortName.map((shortName, index) => {
            const fullName = supportFullName[index];
            return { value: shortName, label: fullName }
        });
        // console.log(options, gradeSclectedDisable, examinationSelected, gradeSclected, gradeOption)
        setGradeOption(options);
        setGradeSclected(options[0]);
        dispatch(setExamination(selectedOption.value));
        dispatch(setGrade(options[0].value));
        // next Button<Boolean> は 無効な時が `true` だから条件を満たすとき反転させる   
        setNextButtonDisable(!(examinationSelected?.value !== null && gradeSclected?.value !== null));
    }

    const handleSelectGradeSclectedChange = (selectedOption: any) => {
        setGradeSclected(selectedOption);
        setNextButtonDisable(!(examinationSelected?.value !== null && gradeSclected?.value !== null));
        dispatch(setGrade(selectedOption.value));
    }

    return (
        <>
            <Typography component="h2" variant="h5" >採点モードの設定</Typography>
            <label>
                <Typography>採点対象の試験を選ぶ<Typography component="span" color="warning.main">(必須)</Typography></Typography>
                <Typography component="div">
                    <Select
                        placeholder="試験の名前"
                        options={examinationTypeOptions.EXAMINATION_LIST}
                        filterOption={examinationTypeOptions.searchFilter}
                        onChange={handleSelectExaminationChange}
                        value={examinationSelected}
                    />
                </Typography>
            </label>
            <label>
                <Typography component="div">級・段を選ぶ
                    <Typography component="span" color="warning.main">(必須)</Typography>
                </Typography>
                <Typography component="div">
                    <Select
                        placeholder="選択..."
                        isDisabled={gradeSclectedDisable}
                        options={gradeOption}
                        value={gradeSclected}
                        isSearchable={false}
                        onChange={handleSelectGradeSclectedChange}
                    />
                </Typography>
            </label>
            <Grid container justifyContent="flex-end" sx={{ marginTop: 15 }}>
                <Typography component="span">
                    <Button variant="contained" startIcon={<NavigateNextIcon />}
                        disabled={nextButtonDisable} component={RouterLink} onClick={handleNextButtonClick}
                        to="/EULA">次に進む</Button>
                </Typography>
            </Grid>
        </>
    )
};

export default Start;