import React, { useState } from "react"
import { Link as RouterLink } from "react-router-dom";
import { RootState } from "..";
import { useDispatch, useSelector } from "react-redux";
import { setOwnAnswerPath } from "../../Features/FilesAndFolderInfo";
import { Alert, AlertTitle, Box, Button, Grid, Typography } from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { stepDown, stepUp } from "../../Features/stepInfo";


const ownAnswerFileInput: React.FC = () => {
    const examAndGradeInfo = useSelector((state: RootState) => state.examinationGradeInfo);
    const fileAndFolderInfo = useSelector((state: RootState) => state.FilesAndFolderInfo);
    const [selectedPath, setSelectedPath] = useState<string>(fileAndFolderInfo.ownAnswerPath === "" ? "" : fileAndFolderInfo.ownAnswerPath);
    const [nextButtonDisable, setNextButtonDisable] = useState(fileAndFolderInfo.ownAnswerPath === "");
    const dispatch = useDispatch();

    const handleSelectFileButtonClick = async () => {
        // @ts-ignore
        const result = await window.FileAndFolderSelect.openDialog();
        console.log(result);
        setSelectedPath(result)

        if (result !== "") {
            setNextButtonDisable(false);
            dispatch(setOwnAnswerPath(result))
        }

    }
    // TODO 選択 を変える
    return (
        <Box sx={{ margin: 1 }}>
            <Typography component="h1" variant="h5">
                あなたの解答を選択してください。
                <Typography component="span" color="warning.main">(必須)</Typography>
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

                <Button variant="outlined" startIcon={<NavigateBeforeIcon />} component={RouterLink} to='/EULA' onClick={() => {
                    dispatch(stepDown());
                    // @ts-ignore
                    window.NavigationOperator.goBack();
                }}>戻る</Button>

                <Button variant="contained"
                    endIcon={<NavigateNextIcon />}
                    component={RouterLink} to='/modelAnswerFileInputScreen'
                    disabled={nextButtonDisable}
                    onClick={() => {
                        dispatch(stepUp())
                    }}>次へ進む</Button>
            </Grid>
        </Box >
    )
}


export default ownAnswerFileInput