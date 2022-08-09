import React, { FC, SyntheticEvent } from 'react';
import { Button, Grid } from '@mui/material';
import { Role } from 'runbotics-common';
import Secured from 'src/components/utils/Secured';
import useTranslations from 'src/hooks/useTranslations';
import FloatingGroup from '../FloatingGroup';
import { FirstActionButton, ImportInput, StyledLabel } from './ModelerPanels.styled';

interface ImportExportPanelProps {
    onImport: (definition: string) => void;
    onExport: () => void;
}

const ImportExportPanel: FC<ImportExportPanelProps> = ({ onExport, onImport }) => {
    const { translate } = useTranslations();
    const handleImport = async (event: SyntheticEvent) => {
        const { files } = event.target as HTMLInputElement;
        const file = files.item(0);
        const definition = await file.text();
        onImport(definition);
    };

    return (
        <FloatingGroup horizontalPosition="left" verticalPosition="bottom">
            <Grid container justifyContent="flex-end">
                <Secured authorities={[Role.ROLE_ADMIN]}>
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
                    <Button onClick={onExport}>
                        {translate('Common.Export')}
                    </Button>
                </Secured>
            </Grid>
        </FloatingGroup>
    );
};

export default ImportExportPanel;
