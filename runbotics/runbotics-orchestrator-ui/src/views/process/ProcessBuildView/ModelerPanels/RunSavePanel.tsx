import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Grid, SvgIcon } from '@mui/material';
import { Role, IProcess } from 'runbotics-common';
import { Send as SendIcon } from 'react-feather';
import Secured from 'src/components/utils/Secured';
import useTranslations from 'src/hooks/useTranslations';
import FloatingGroup from '../FloatingGroup';
import { StyledBotProcessRunner } from './ModelerPanels.styled';

interface RunSavePanelProps {
    process: IProcess;
    onRunClick: () => void;
    onSave: () => void;
}

const RunSavePanel: FC<RunSavePanelProps> = ({ onRunClick, onSave, process }) => {
    const { translate } = useTranslations();

    return (
        <FloatingGroup horizontalPosition="right" verticalPosition="top">
            <Grid container justifyContent="flex-end">
                <StyledBotProcessRunner process={process} onRunClick={onRunClick} />
                <Secured authorities={[Role.ROLE_ADMIN]}>
                    <Button
                        onClick={onSave}
                        variant="contained"
                        color="secondary"
                        startIcon={(
                            <SvgIcon fontSize="small">
                                <SendIcon />
                            </SvgIcon>
                            )}
                    >
                        {translate('Common.Save')}
                    </Button>
                </Secured>
            </Grid>
        </FloatingGroup>
    );
};

export default RunSavePanel;
