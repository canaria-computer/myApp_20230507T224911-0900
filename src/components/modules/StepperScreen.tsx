import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../web';


const StepperScreen: React.FC = () => {
    const info = useSelector((state: RootState) => state.stepper);

    return (
        <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
            <Stepper activeStep={info.activeStep} alternativeLabel>
                {info.step.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}

export default StepperScreen  