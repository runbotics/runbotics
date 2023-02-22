import React, { FC } from 'react';

import { Button, Grid, SvgIcon, Tooltip, Badge } from '@mui/material';
import { Send as SendIcon } from 'react-feather';
import { Role, IProcess } from 'runbotics-common';

import Secured from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import { ModelerErrorType } from '#src-app/store/slices/Process';

import FloatingGroup from '../FloatingGroup';
import { StyledBotProcessRunner } from './ModelerPanels.styled';
import TooltipError from './TooltipError';

interface RunSavePanelProps {
    process: IProcess;
    onRunClick: () => void;
    onSave: () => void;
}

const RunSavePanel: FC<RunSavePanelProps> = ({
    onRunClick,
    onSave,
    process,
}) => {
    const { translate } = useTranslations();
    const { isSaveDisabled, errors } = useSelector(
        (state) => state.process.modeler
    );
    const getTooltip = () => {
        const elementsWithFromErrors = errors
            .map((error) =>
                error.type === ModelerErrorType.FORM_ERROR
                    ? error.elementName
                    : null
            )
            .filter((element) => element !== null);

        const elementsWithConnectionErrors = errors
            .map((error) =>
                error.type === ModelerErrorType.CONNECTION_ERROR
                    ? error.elementName
                    : null
            )
            .filter((element) => element !== null);

        if (
            elementsWithConnectionErrors.length ||
            elementsWithFromErrors.length
        ) {
            return (
                <TooltipError
                    elementsWithConnectionErrors={elementsWithConnectionErrors}
                    elementsWithFromErrors={elementsWithFromErrors}
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
                    <Badge badgeContent={errors.length} color="error" max={5}>
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
