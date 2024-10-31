import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import ConditionalTooltip from '#src-app/components/ConditionalTooltip/ConditionalTooltip';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import CreateGeneralInfoFormDialog from './CreateGeneralInfo/CreateGeneralInfoFormDialog';

interface AddCredentialButtonProps {
    disabled: boolean;
}

const AddCredentialButton: FC<AddCredentialButtonProps> = ({ disabled }) => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);

    return (
        <>
            <ConditionalTooltip display={disabled} title={translate('Credential.Add.CollectionNotFound.Info')}>
                <span>
                    <Button
                        disabled={disabled}
                        color="primary"
                        variant="contained"
                        onClick={() => setShowDialog(true)}
                        startIcon={
                            <SvgIcon fontSize="small">
                                <AddCircleOutlineIcon />
                            </SvgIcon>
                        }
                    >
                        {translate('Credentials.Add')}
                    </Button>
                </span>
            </ConditionalTooltip>
            <If condition={showDialog}>
                <CreateGeneralInfoFormDialog open={showDialog} onClose={() => setShowDialog(false)}/>
            </If>
        </>
    );
};

export default AddCredentialButton;

