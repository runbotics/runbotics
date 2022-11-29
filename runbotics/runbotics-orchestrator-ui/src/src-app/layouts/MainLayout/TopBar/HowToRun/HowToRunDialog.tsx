import React, { FC } from 'react';

import {
    Avatar,
    Box,
    colors,
    DialogContentText,
    Grid,
    Step,
    StepConnector,
    StepLabel,
    Stepper,
    Dialog, DialogContent, DialogTitle, 
} from '@mui/material';
import clsx from 'clsx';
import styled from 'styled-components';

import useLocalStorage from '#src-app/hooks/useLocalStorage';
import useTranslations from '#src-app/hooks/useTranslations';

import CompleteStep from './CompleteStep';
import ConnectStep from './ConnectStep';
import { CustomStepIconProps } from './CustomSteps.types';
import InstallStep from './InstallStep';
import RunStep from './RunStep';
import useInstallSteps from './useInstallSteps';

const DIALOG_PREFIX = 'HowToRunDialog';
const ICON_PREFIX = 'CustomStepIcon';

const iconClasses = {
    root: `${ICON_PREFIX}-root`,
    active: `${ICON_PREFIX}-active`,
    completed: `${ICON_PREFIX}-completed`,
};

const dialogClasses = {
    root: `${DIALOG_PREFIX}-root`,
    avatar: `${DIALOG_PREFIX}-avatar`,
    stepper: `${DIALOG_PREFIX}-stepper`,
    vertical: `${DIALOG_PREFIX}-vertical`,
    line: `${DIALOG_PREFIX}-line`,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        minHeight: '100%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    avatar: {
        backgroundColor: colors.red[600],
    },
    stepper: {
        backgroundColor: 'transparent',
    },
    vertical: {
        marginLeft: 19,
        padding: 0,
    },
    line: {
        borderColor: theme.palette.divider,
    },
}));

const CustomStepConnector = StepConnector;

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    [`& .${iconClasses.root}`]: {},

    [`& .${iconClasses.active}`]: {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: theme.shadows[10],
        color: theme.palette.secondary.contrastText,
    },

    [`& .${iconClasses.completed}`]: {
        backgroundColor: colors.green[700],
        color: theme.palette.secondary.contrastText,
    },
}));

const CustomStepIcon: FC<CustomStepIconProps> = ({
    active, completed, icon, steps,
}) => {
    const Icon = steps[icon].icon;

    return (
        <StyledAvatar
            className={clsx(iconClasses.root, {
                [iconClasses.active]: active,
                [iconClasses.completed]: completed,
            })}
        >
            <Icon />
        </StyledAvatar>
    );
};

interface HowToRunDialogProps {
    open: boolean;
    onClose?: () => void;
}

const HowToRunDialog: FC<HowToRunDialogProps> = ({ open, onClose }) => {
    const [activeStep, setActiveStep] = useLocalStorage('HowToRunDialog', 0);
    const { translate } = useTranslations();
    const steps =  useInstallSteps();

    const handleNext = (): void => {
        setActiveStep(+activeStep + 1);
    };

    const handleComplete = (): void => {
        onClose();
        setTimeout(() => {
            setActiveStep(0);
        }, 0);
    };

    return (
        <StyledDialog maxWidth="md" open={open} onClose={onClose} fullWidth>
            <DialogTitle>{translate('Install.Dialog.Title')}</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12} md={3}>
                        <Stepper
                            activeStep={activeStep}
                            className={dialogClasses.stepper}
                            connector={(
                                <CustomStepConnector
                                    classes={{
                                        vertical: dialogClasses.vertical,
                                        line: dialogClasses.line,
                                    }}
                                />
                            )}
                            orientation="vertical"
                        >
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel
                                        StepIconComponent={() => (
                                            <CustomStepIcon
                                                icon={index}
                                                steps={steps}
                                            />
                                        )}
                                    >
                                        {step.label}
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <>
                            <Box p={3} height="100%">
                                {activeStep === 0 && (
                                    <InstallStep
                                        onBack={handleComplete}
                                        onComplete={() => setActiveStep(+activeStep + 1)}
                                    />
                                )}
                                {activeStep === 1 && (
                                    <ConnectStep onComplete={() => setActiveStep(+activeStep + 1)} />
                                )}
                                {activeStep === 2 && <RunStep onBack={handleComplete} onComplete={handleNext} />}
                                {activeStep === 3 && <CompleteStep onComplete={handleComplete} />}
                            </Box>
                        </>
                    </Grid>
                </Grid>
                <DialogContentText />
            </DialogContent>
        </StyledDialog>
    );
};

export default HowToRunDialog;
