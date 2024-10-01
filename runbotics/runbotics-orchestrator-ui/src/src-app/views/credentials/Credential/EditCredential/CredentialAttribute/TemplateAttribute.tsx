import { FC, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';

import { Typography, Grid, Button } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';

import { useSnackbar } from 'notistack';

import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';

import { credentialsActions } from '#src-app/store/slices/Credentials';


import { AttributeIcon, AttributeInfoNotEdiable, StyledAttributeCard, StyledGridContainer } from './Attribute.styles';
import { CredentialTemplateAttribute } from './Attribute.types';
import CredentialAttributeDetails from './CredentialAttributeDetails';

type TemplateAttributeProps = {
    credentialId: string;
    attribute: CredentialTemplateAttribute;
    isNewCredential: boolean;
    canEdit: boolean;
};

const TemplateAttribute: FC<TemplateAttributeProps> = ({ credentialId, attribute, isNewCredential, canEdit }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(isNewCredential);
    const [currentAttribute, setCurrentAttribute] = useState({
        masked: true,
        value: ''
    });
    const { enqueueSnackbar } = useSnackbar();

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setCurrentAttribute({
            masked: true,
            value: ''
        });
        setIsEditMode(false);
    };

    const handleConfirm = (credentialIdToUpdate: string, attributeName: string) => {
        if (currentAttribute.value.trim() === '') {
            enqueueSnackbar(translate('Credential.Attribute.Edit.Fail.NoValue'), { variant: 'error' });
            setIsEditMode(false);
            return;
        };

        dispatch(
            credentialsActions.updateAttribute({
                resourceId: `/${credentialIdToUpdate}/UpdateAttribute/${attributeName}`,
                payload: currentAttribute
            })
        ).then(() => {
            enqueueSnackbar(translate('Credential.Attribute.Edit.Success'), { variant: 'success' });
            setCurrentAttribute({
                masked: true,
                value: ''
            });
            setIsEditMode(false);
        })
            .catch((error => {
                enqueueSnackbar(error.message, { variant: 'error' });
            }));
    };

    const handleFieldChange = (value: string) => {
        setCurrentAttribute({
            masked: true,
            value
        });
    };

    return (
        <StyledAttributeCard isEditMode={isEditMode}>
            <StyledGridContainer container rowSpacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">{translate('Credential.Attribute.Name.Label')}</Typography>
                    <AttributeInfoNotEdiable>{attribute.name}</AttributeInfoNotEdiable>
                </Grid>
                <Grid item xs={12} marginBottom="16px">
                    <Typography variant="h6">{translate('Credential.Attribute.Description.Label')}</Typography>
                    <AttributeInfoNotEdiable>{attribute.description}</AttributeInfoNotEdiable>
                </Grid>
                <CredentialAttributeDetails
                    handleFieldChange={handleFieldChange}
                    currentAttribute={currentAttribute}
                    isEditMode={isEditMode}
                    canEdit={canEdit}
                    setIsEditMode={setIsEditMode}
                />
                <Collapse in={isEditMode} orientation="vertical" sx={{ width: '100%' }}>
                    <Grid container xs={12} justifyContent="space-between">
                        <Grid item>
                            <Button size="small" onClick={handleCancel} sx={{ padding: 0, color: grey[600] }}>
                                <AttributeIcon>
                                    <ClearIcon />
                                </AttributeIcon>
                                <Typography variant="h5">{translate('Common.Cancel').toUpperCase()}</Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                size="small"
                                color="secondary"
                                onClick={() => handleConfirm(credentialId, attribute.name)}
                                sx={{ padding: '0 8px 0 0' }}
                            >
                                <AttributeIcon color="inherit">
                                    <DoneIcon />
                                </AttributeIcon>
                                <Typography variant="h5">{translate('Common.Confirm').toUpperCase()}</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </StyledGridContainer>
        </StyledAttributeCard>
    );
};

export default TemplateAttribute;
