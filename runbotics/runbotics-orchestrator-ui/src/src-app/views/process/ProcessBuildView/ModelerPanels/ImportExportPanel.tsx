import React, { FC, SyntheticEvent } from 'react';

import { Button, Grid, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Role } from 'runbotics-common';

import Secured from '#src-app/components/utils/Secured';

import useProcessImport from '#src-app/hooks/useProcessImport';
import useTranslations from '#src-app/hooks/useTranslations';

import axiosApi from '#src-app/utils/axios';

import {
    FirstActionButton,
    ImportInput,
    StyledLabel,
} from './ModelerPanels.styled';
import FloatingGroup from '../FloatingGroup';

import { AdditionalInfo } from '../Modeler/BpmnModeler';

interface ImportExportPanelProps {
    onImport: (definition: string, additionalInfo: AdditionalInfo) => void;
    onExport: () => void;
}

const ACCEPTED_FILE_EXTENSIONS = ['rbex', 'bpmn', 'xml'];

const ImportExportPanel: FC<ImportExportPanelProps> = ({
    onExport,
    onImport,
}) => {
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();
    const { extractImportInfo } = useProcessImport();
    const handleImport = async (event: SyntheticEvent) => {
        const { files } = event.target as HTMLInputElement;
        const file = files.item(0);
        const extension = file.name.split('.').at(-1);
        const isValidExtension = ACCEPTED_FILE_EXTENSIONS.includes(
            extension.toLowerCase()
        );
        if (!isValidExtension) {
            enqueueSnackbar(
                translate('Common.Import.InvalidExtension', {
                    extensions: ACCEPTED_FILE_EXTENSIONS.join(', '),
                }),
                {
                    variant: 'error',
                }
            );
            return;
        }
        const rawDefinition = await file.text();
        const { definition, ...additionalInfo } =
            extractImportInfo(rawDefinition);
        const isImportBlacklisted = await axiosApi.post(
            '/api/scheduler/blacklist-action-auth/check',
            { definition }
        );
        
        if (isImportBlacklisted.data) {
            enqueueSnackbar(
                translate('Common.Import.Blacklist.Error'),
                {
                    variant: 'error',
                }
            );
            return;
        }
        onImport(definition, {
            ...additionalInfo,
        });
    };

    return (
        <FloatingGroup horizontalPosition="left" verticalPosition="bottom">
            <Grid container justifyContent="flex-end">
                <Secured authorities={[Role.ROLE_ADMIN]}>
                    <Tooltip
                        title={translate('Process.MainView.Tooltip.Import')}
                    >
                        <FirstActionButton>
                            <StyledLabel htmlFor="contained-button-file">
                                <ImportInput
                                    type="file"
                                    onChange={handleImport}
                                    id="contained-button-file"
                                />
                                {translate('Common.Import')}
                            </StyledLabel>
                        </FirstActionButton>
                    </Tooltip>
                    <Tooltip
                        title={translate('Process.MainView.Tooltip.Export')}
                    >
                        <Button onClick={onExport}>
                            {translate('Common.Export')}
                        </Button>
                    </Tooltip>
                </Secured>
            </Grid>
        </FloatingGroup>
    );
};

export default ImportExportPanel;
