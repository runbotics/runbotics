import React, { FC } from 'react';

import { Button, Grid, SvgIcon, Tooltip, Badge } from '@mui/material';
import { Send as SendIcon } from 'react-feather';
import { Role, IProcess } from 'runbotics-common';

import Secured from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import FloatingGroup from '../FloatingGroup';
import { StyledBotProcessRunner } from './ModelerPanels.styled';

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

    return (
        <FloatingGroup horizontalPosition="right" verticalPosition="top">
            <Grid container justifyContent="flex-end">
                <StyledBotProcessRunner
                    process={process}
                    onRunClick={onRunClick}
                />
                <Secured authorities={[Role.ROLE_ADMIN]}>
                    <Badge badgeContent={errors.length} color="error" max={5}>
                        <Tooltip
                            title={
                                isSaveDisabled
                                    ? translate(
                                        'Process.MainView.Tooltip.Save.Disabled'
                                    )
                                    : translate(
                                        'Process.MainView.Tooltip.Save.Enabled'
                                    )
                            }
                        >
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
