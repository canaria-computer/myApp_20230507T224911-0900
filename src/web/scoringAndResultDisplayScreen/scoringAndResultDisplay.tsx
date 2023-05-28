import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Avatar, Box, Button, Container, Grid, LinearProgress, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import VerifiedIcon from "@mui/icons-material/Verified";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import SourceIcon from '@mui/icons-material/Source';
import CodeIcon from '@mui/icons-material/Code';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link as RouterLink } from "react-router-dom";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "..";
import { setStep, stepDown, stepUp } from "../../Features/stepInfo";
import { resetPath, setModelAnswerPath, setOwnAnswerPath } from "../../Features/FilesAndFolderInfo"; // TODO elase

const scoringAndResultDisplay = () => {
    const [isScoringNow, setIsScoringNow] = useState(true)
    const stepperInfo = useSelector((state: RootState) => state.stepper);
    const examAndGradeInfo = useSelector((state: RootState) => state.examinationGradeInfo);
    const fileAndFolderInfo = useSelector((state: RootState) => state.FilesAndFolderInfo);
    const dispatch = useDispatch();

    const [fetchScoringResult, setFetchScoringResult] = useState({
        score: 0
    });

    // ! ---再試行用 (test)-------------------
    const [retry, setRetry] = useState(0);
    // ! ------------------------------------

    useEffect(() => {
        (async () => {
            console.log("最初だけ実行する");
            // @ts-ignore
            const result = await window.scoringApps.scoreringInstantiation(
                fileAndFolderInfo.ownAnswerPath,
                fileAndFolderInfo.modelAnswerPath
            )
            console.log(result);
            setFetchScoringResult(result);
            setIsScoringNow(false);
            dispatch(stepUp());
        })();
    }, [retry])

    const handleExitButtonClick = () => {
        // @ts-ignore
        window.appExit.exit();
    }

    const handleGoHomeButtonClick = () => {
        dispatch(setStep(0));
        dispatch(resetPath())
    }


    return (
        <Box sx={{ mx: 2 }}>
            {isScoringNow ? <ScoringNow /> : <ShowResult {...fetchScoringResult} />}

            {!isScoringNow &&
                <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                    <Button variant="outlined" startIcon={<HomeIcon />} component={RouterLink}
                        to="/" onClick={handleGoHomeButtonClick}>最初の画面に戻る</Button>
                    <Button variant="outlined" endIcon={<ExitToAppIcon />}
                        disabled={false} onClick={handleExitButtonClick}>アプリを終了</Button>
                </Grid>
            }
        </Box>

    )
}

const ScoringNow = () => {
    return (
        <>
            <Box sx={{ width: "100%" }}>
                <LinearProgress />
            </Box>
            <Typography component="h2" variant="h5">採点中</Typography>
        </>
    )
}

const ShowResult = ({ score, ...fetchScoringResult }: { score: number, [key: string]: any }) => {

    const isPass = score >= 80;

    return (
        <>
            {/* // todo prop からデータを受け取り 展開する表示 */}
            <Typography component="h2" variant="h4" ><DoneIcon color="success" fontSize="large" />採点完了</Typography>
            <List sx={{ width: "100%", bgcolor: "background.paper", }}>
                <ListItem>
                    <ListItemAvatar>
                        {
                            isPass ?
                                <VerifiedIcon color="success" fontSize="large" /> :
                                <MoodBadIcon color="warning" fontSize="large" />
                        }
                    </ListItemAvatar>
                    <ListItemText primary={`点数:${score}点`} secondary={isPass ? "合格の可能性が高い" : "合格の可能性が低い"} />
                </ListItem>
                {/*// ? 試験区分で出力が変わる */}
                <HomepageBuildingScore {...fetchScoringResult} />
            </List>
        </>
    )
}

const HomepageBuildingScore = ({ ...fetchScoringResult }) => {

    const inspectionDataArray = (fetchScoringResult.inspectionDataArray as [string, boolean, number][])
        .filter((element) => element[1])
        .map(row => [...row, uuidv4()]) as [string, boolean, number, string][]
    const failedComparHashValue = fetchScoringResult.failedComparHashValue;
    const [accordionExpanded, setAccordionExpanded] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setAccordionExpanded(true)
        }, 750);
    }, []);
    const handleAccorionExpandedClick = () => {
        setAccordionExpanded(!accordionExpanded)
    }

    return (
        <>
            <ListItem>
                <ListItemAvatar><SourceIcon /></ListItemAvatar>
                <Accordion expanded={accordionExpanded} >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={handleAccorionExpandedClick}
                    >ファイル検査結果</AccordionSummary>
                    <AccordionDetails>
                        {
                            failedComparHashValue.length > 0 &&
                            <Alert severity="warning">
                                <AlertTitle>警告</AlertTitle>
                                試験に使うファイルが破損しているなどの理由でファイルが同一であると
                                <strong>検証できなかったものです</strong>。
                            </Alert>
                        }

                        {
                            failedComparHashValue.length !== 0 ?
                                failedComparHashValue.map(
                                    (element: string) => <Typography key={uuidv4()}><DescriptionIcon />{element}</Typography>
                                )
                                : <Alert severity="success">問題はありませんでした。</Alert>
                        }
                    </AccordionDetails>
                </Accordion>
            </ListItem>
            <ListItem>
                <ListItemAvatar><CodeIcon /></ListItemAvatar>
                {/* <ListItemText></ListItemText> */}
                <Accordion defaultExpanded={true}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >ソースコード検査結果</AccordionSummary>
                    <AccordionDetails >
                        <Alert severity="info">
                            <AlertTitle>情報提供</AlertTitle>
                            ソースコードを解析し模範解答と
                            <strong>一致しませんでした</strong>。
                            <small>
                                <strong>検査情報の実行テスト</strong>として常に -1点 減点されます。
                                ただし、集計後に1点追加され 100点になります。
                            </small>
                        </Alert>

                        {
                            inspectionDataArray.map(element => {
                                return (
                                    <div key={uuidv4()}>
                                        <Typography variant="caption" display="block" key={element[3]}>
                                            {element[0]}
                                            <strong> -{element[2]}点 </strong>
                                        </Typography>
                                    </div>
                                )
                            })
                        }

                    </AccordionDetails>
                </Accordion>
            </ListItem>
        </>
    )
}

export default scoringAndResultDisplay;