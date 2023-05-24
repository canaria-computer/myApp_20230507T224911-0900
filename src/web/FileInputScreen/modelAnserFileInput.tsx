import React, { useState } from "react"
import { Link as RouterLink } from "react-router-dom";
import { RootState } from "..";
import { useDispatch, useSelector } from "react-redux";
import { setModelAnswerPath } from "../../Features/FilesAndFolderInfo";
import { Alert, AlertTitle, Box, Button, Grid, Typography } from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { stepDown, stepUp } from "../../Features/stepInfo";


const modelAnswerFileInput: React.FC = () => {
    const examAndGradeInfo = useSelector((state: RootState) => state.examinationGradeInfo);
    const fileAndFolderInfo = useSelector((state: RootState) => state.FilesAndFolderInfo);
    const [selectedPath, setSelectedPath] = useState<string>(fileAndFolderInfo.modelAnswerPath === "" ? "" : fileAndFolderInfo.modelAnswerPath);
    const [nextButtonDisable, setNextButtonDisable] = useState(fileAndFolderInfo.modelAnswerPath === "");
    const dispatch = useDispatch();

    const handleSelectFileButtonClick = async () => {
        // @ts-ignore
        const result = await window.FileAndFolderSelect.openDialog();
        console.log(result);
        setSelectedPath(result)
        dispatch(setModelAnswerPath(result))

        if (result !== "") {
            setNextButtonDisable(false);
            dispatch(setModelAnswerPath(result))
        }
    }
    // TODO 選択 を変える
    return (
        <Box sx={{ margin: 1 }}>
            <Typography component="h1" variant="h5"><strong>模範解答</strong>を選択してください。<Typography component="span" color="warning.main">(必須)</Typography>
            </Typography>

            {   //* HP の人には 情報を追加で提供
                examAndGradeInfo.examination === "HP" &&
                <Alert severity="info" sx={{ margin: 1 }}>
                    <AlertTitle>info : [参考情報]</AlertTitle>
                    ホームページ作成検定は フォルダごと調べるため
                    <strong>index.html</strong>が存在するフォルダを選択する必要があります。
                </Alert>
            }

            <Typography component="div" sx={{ marginBottom: 5 }}>
                <Button variant="contained"
                    startIcon={
                        // * HP は フォルダを選ぶアイコン
                        examAndGradeInfo.examination === "HP" ?
                            <FolderOpenIcon /> :
                            <UploadFileIcon />
                    }
                    onClick={handleSelectFileButtonClick}
                >
                    {examAndGradeInfo.examination === "HP" ?
                        "フォルダ" : "ファイル"
                    }を選択</Button>
                <Typography component="span">{selectedPath}</Typography>
            </Typography>

            {/* //!  ファイル フォルダ 切り替えをする */}
            <Grid container justifyContent="space-between" sx={{ margin: 2, flexWrap: "wrap-reverse", padding: "0 20px" }}>

                <Button variant="outlined" startIcon={<NavigateBeforeIcon />} component={RouterLink} to='/ownAnswerFileInputScreen' onClick={() => {
                    dispatch(stepDown());
                    // @ts-ignore
                    window.NavigationOperator.goBack();
                }}>戻る</Button>

                <Button variant="contained"
                    endIcon={<NavigateNextIcon />}
                    component={RouterLink} to='/scoringAndResultDisplayScreen' disabled={nextButtonDisable} onClick={() => {
                        dispatch(stepUp())
                    }}>採点を開始</Button>
            </Grid>
        </Box>
    )
}

export default modelAnswerFileInput