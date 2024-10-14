import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon, Tooltip } from '@mui/material';

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
            <Tooltip
                disableHoverListener={!disabled}
                title={translate('Credential.Add.CollectionNotFoundInfo')}
                slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -14],
                                },
                            },
                        ],
                    },
                }}>
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
            </Tooltip>
            <If condition={showDialog}>
                <CreateGeneralInfoFormDialog open={showDialog} onClose={() => setShowDialog(false)}/>
            </If>
        </>
    );
};

export default AddCredentialButton;

