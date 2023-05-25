import { Backdrop, Box, Button, CircularProgress, LinearProgress, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '..';
import { stepUp } from '../../Features/stepInfo';


const scoringAndResultDisplay = () => {
    const [isScoringNow, setIsScoringNow] = useState(true)
    const stepperInfo = useSelector((state: RootState) => state.stepper);
    const examAndGradeInfo = useSelector((state: RootState) => state.examinationGradeInfo);
    const dispatch = useDispatch();

    return (
        <>
            scoringAndResultDisplay

            {isScoringNow ? <ScoringNow /> : <ShowResult />}
            <button onClick={() => { setIsScoringNow(!isScoringNow); dispatch(stepUp()) }}>debug [toggle mode]</button>
            <button onClick={() => {
                console.log(stepperInfo, examAndGradeInfo);
            }}>debug</button>
        </>
    )
}

const ScoringNow = () => {
    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={true}
                onClick={() => { }}
            >
                <CircularProgress color="inherit" />
            </Backdrop >
            <Box sx={{ width: '100%' }}><LinearProgress /></Box>
            <Typography component="h2" variant="h5">採点中</Typography>
        </>
    )
}

const ShowResult = () => {
    return (
        <><Typography component="h2" variant="h5" ><DoneIcon color='success' />採点完了</Typography></>
    )
}

export default scoringAndResultDisplay;