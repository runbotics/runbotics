import React from 'react';

import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import useTranslations from 'src/hooks/useTranslations';

import { useModeler } from '../RunboticsModuleRenderer';
import SeleniumImporter from './SeleniumImporter';

const SeleniumImporterButton = () => {
    const modeler = useModeler();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();

    const handleImportSelenium = async (event) => {
        const seleniumImporter = new SeleniumImporter(modeler);
        const result = await seleniumImporter.import(event);
        if (result.error) 
        { enqueueSnackbar(translate('Process.Details.Modeler.Extensions.Tasks.Selenium.Import.Error'), {
            variant: 'error',
        }); }
        
    };

    return (
        <>
            <Button onClick={handleImportSelenium}>
                {translate('Process.Details.Modeler.Extensions.Tasks.Selenium.Import')}
            </Button>
        </>
    );
};

export default SeleniumImporterButton;
