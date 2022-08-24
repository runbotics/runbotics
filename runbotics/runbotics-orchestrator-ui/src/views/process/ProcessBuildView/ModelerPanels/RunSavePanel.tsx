import React, { FC, useMemo } from 'react';
import { Button, Grid, SvgIcon } from '@mui/material';
import { Role, IProcess } from 'runbotics-common';
import { Send as SendIcon } from 'react-feather';
import Secured from 'src/components/utils/Secured';
import useTranslations from 'src/hooks/useTranslations';
import FloatingGroup from '../FloatingGroup';
import { StyledBotProcessRunner } from './ModelerPanels.styled';
import { isSaveDisabled } from '../Modeler/utils';
import { useSelector } from 'src/store';
import _ from 'lodash';
import { useModelerContext } from 'src/providers/Modeler.provider';

interface RunSavePanelProps {
    process: IProcess;
    onRunClick: () => void;
    onSave: () => void;
}

const RunSavePanel: FC<RunSavePanelProps> = ({ onRunClick, onSave, process }) => {
    const { translate } = useTranslations();
    const { modeler } = useModelerContext();
    const processModelerStore = useSelector((state) => state.process.modeler);

    return (
        <FloatingGroup horizontalPosition="right" verticalPosition="top">
            <Grid container justifyContent="flex-end">
                <StyledBotProcessRunner process={process} onRunClick={onRunClick} />
                <Secured authorities={[Role.ROLE_ADMIN]}>
                    <Button
                        onClick={onSave}
                        variant="contained"
                        color="secondary"
                        disabled={isSaveDisabled(processModelerStore, modeler)}
                        startIcon={
                            <SvgIcon fontSize="small">
                                <SendIcon />
                            </SvgIcon>
                        }
                    >
                        {translate('Common.Save')}
                    </Button>
                </Secured>
            </Grid>
        </FloatingGroup>
    );
};

export default RunSavePanel;
