import { FC } from 'react';

import { Typography } from '@mui/material';
import { Credential } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import { translate } from '#src-app/hooks/useTranslations';

import { AdditionalInfo } from './Modeler/BpmnModeler';
import { handleClearImportedCredentials, mapCredentialsToList } from './ProcessImportDialog.utils';

interface ProcessImportDialogProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    credentials: Credential[];
    importDraft: (definition: string, additionalInfo: AdditionalInfo) => void;
    processDefinition: string;
    additionalProps: AdditionalInfo;
}

const ProcessImportDialog: FC<ProcessImportDialogProps> = ({
    isOpen,
    setIsOpen,
    credentials,
    importDraft,
    processDefinition,
    additionalProps,
}) => (
    <CustomDialog
        title={translate('Process.BuildView.Import.Dialog.Title')}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        confirmButtonOptions={{
            label: translate('Process.BuildView.Import.Dialog.Button.Clear'),
            onClick: () => handleClearImportedCredentials({
                definition: processDefinition,
                additionalInfo: additionalProps,
                setOpen: setIsOpen,
                importDraft,
            }),
        }}
        cancelButtonOptions={{
            label: translate('Process.BuildView.Import.Dialog.Button.Keep'),
            onClick: () => { setIsOpen(!isOpen); importDraft(processDefinition, additionalProps); },
        }}
    >
        <Typography>{translate('Process.BuildView.Import.Dialog.Message.Top')}</Typography>
        {mapCredentialsToList(credentials)}
        <Typography>{translate('Process.BuildView.Import.Dialog.Message.Bottom')}</Typography>
    </CustomDialog>
);

export default ProcessImportDialog;
