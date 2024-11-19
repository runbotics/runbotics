import React, { FC } from 'react';

import { Button, Grid, SvgIcon, Tooltip, Badge } from '@mui/material';
import { Send as SendIcon } from 'react-feather';
import { Role, ProcessDto } from 'runbotics-common';

import Secured from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import { ModelerErrorType } from '#src-app/store/slices/Process';

import { StyledBotProcessRunner } from './ModelerPanels.styled';
import TooltipError from './TooltipError';
import FloatingGroup from '../FloatingGroup';

interface RunSavePanelProps {
    process: ProcessDto;
    onRunClick: () => void;
    onSave: () => void;
}

const RunSavePanel: FC<RunSavePanelProps> = ({
    onRunClick,
    onSave,
    process,
}) => {
    const { translate } = useTranslations();
    const { isSaveDisabled, errors, customValidationErrors } = useSelector(
        (state) => state.process.modeler
    );

    const getTooltip = () => {
        const {
            formErrorElementsNames,
            connectionErrorElementsNames,
            canvasErrorElementsNames,
        } = [ ...errors, ...customValidationErrors].reduce(
            (acc, prev) => {
                if (prev.type === ModelerErrorType.FORM_ERROR) {
                    acc.formErrorElementsNames.push(prev.elementName);
                }
                if (prev.type === ModelerErrorType.CONNECTION_ERROR) {
                    acc.connectionErrorElementsNames.push(prev.elementName);
                }
                if (prev.type === ModelerErrorType.CANVAS_ERROR) {
                    acc.canvasErrorElementsNames.push(prev.elementName);
                }
                return acc;
            },
            {
                formErrorElementsNames: [],
                connectionErrorElementsNames: [],
                canvasErrorElementsNames: [],
            }
        );

        if (
            connectionErrorElementsNames.length ||
            formErrorElementsNames.length ||
            canvasErrorElementsNames.length
        ) {
            return (
                <TooltipError
                    connectionErrorElementsNames={connectionErrorElementsNames}
                    formErrorElementsNames={formErrorElementsNames}
                    canvasErrorElementNames={canvasErrorElementsNames}
                />
            );
        }
        if (isSaveDisabled) {
            return translate('Process.MainView.Tooltip.Save.Disabled');
        }

        return translate('Process.MainView.Tooltip.Save.Enabled');
    };

    return (
        <FloatingGroup horizontalPosition="right" verticalPosition="top">
            <Grid container justifyContent="flex-end">
                <StyledBotProcessRunner
                    process={process}
                    onRunClick={onRunClick}
                />
                <Secured authorities={[Role.ROLE_ADMIN]}>
                    <Badge badgeContent={errors.length || customValidationErrors.length} color="error" max={5}>
                        <Tooltip title={getTooltip()}>
                            <span>
                                <Button
                                    onClick={onSave}
                                    variant="contained"
                                    color="secondary"
                                    disabled={isSaveDisabled}
                                    startIcon={
                                        <SvgIcon fontSize="small">
                                            <SendIcon />
                                        </SvgIcon>
                                    }
                                >
                                    {translate('Common.Save')}
                                </Button>
                            </span>
                        </Tooltip>
                    </Badge>
                </Secured>
            </Grid>
        </FloatingGroup>
    );
};

export default RunSavePanel;
