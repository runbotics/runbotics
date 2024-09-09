import { FC, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import { Typography, Grid, Button, Fade, Divider } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';

import { credentialsActions } from '#src-app/store/slices/Credentials';

import { fetchOneCredential } from '#src-app/store/slices/Credentials/Credentials.thunks';

import { AttributeIcon, AttributeInfoNotEdiable, StyledAttributeCard, StyledGridContainer } from './Attribute.styles';
import { DisplayAttribute } from './Attribute.types';
import CredentialAttributeDetails from '../CredentialAttributeDetails/CredentialAttributeDetials';

type TemplateAttributeProps = {
    credentialId: string;
    attribute: DisplayAttribute;
    isNewCredential: boolean;
};

const TemplateAttribute: FC<TemplateAttributeProps> = ({ credentialId, attribute, isNewCredential }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(isNewCredential);
    const [currentAttribute, setCurrentAttribute] = useState({
        masked: true,
        value: ''
    });
    const [currentValue, setCurrentValue] = useState('[hidden]');

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
        dispatch(
            credentialsActions.updateAttribute({
                resourceId: `/${credentialIdToUpdate}/UpdateAttribute/${attributeName}`,
                payload: currentAttribute
            })
        ).unwrap().then((response => {
            dispatch(fetchOneCredential({resourceId: response.id}));
        }));
        setCurrentAttribute({
            masked: true,
            value: ''
        });
        setCurrentValue('[hidden]');
        setIsEditMode(false);
    };

    const handleFieldChange = (value) => {
        setCurrentAttribute({
            masked: true,
            value
        });
    };

    return (
        <Grid item spacing={2}>
            <StyledAttributeCard>
                <StyledGridContainer container rowSpacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">{translate('Credential.Attribute.Name.Label')}</Typography>
                        <AttributeInfoNotEdiable>{attribute.name}</AttributeInfoNotEdiable>
                    </Grid>
                    <Grid item xs={12} marginBottom="16px">
                        <Typography variant="h6">{translate('Credential.Attribute.Description.Label')}</Typography>
                        <AttributeInfoNotEdiable>{attribute.description}</AttributeInfoNotEdiable>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignSelf: 'center' }}>
                        <If condition={!isEditMode}>
                            <Fade in={!isEditMode}>
                                <Button size="small" onClick={handleEdit} sx={{ marginRight: '4px' }}>
                                    <EditIcon sx={{ marginRight: '8px', color: grey[700] }} />
                                    <Typography variant="h5" sx={{ color: grey[700] }}>
                                        {translate('Credential.Attribute.Edit.Edit').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Fade>
                        </If>
                    </Grid>
                </StyledGridContainer>
                <Collapse in={isEditMode} orientation="vertical" sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        {isEditMode && <Divider variant="middle" />}
                        <CredentialAttributeDetails handleFieldChange={handleFieldChange} currentValue={currentValue} setCurrentValue={setCurrentValue}/>
                        <StyledGridContainer container justifyContent="space-between" sx={{ marginBottom: 0 }}>
                            <Grid item>
                                <Button size="small" onClick={handleCancel} sx={{ padding: 0, color: grey[600] }}>
                                    <AttributeIcon>
                                        <ClearIcon />
                                    </AttributeIcon>
                                    <Typography variant="h5">{translate('Credential.Attribute.Edit.Cancel').toUpperCase()}</Typography>
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
                                    <Typography variant="h5">{translate('Credential.Attribute.Edit.Confirm').toUpperCase()}</Typography>
                                </Button>
                            </Grid>
                        </StyledGridContainer>
                    </Grid>
                </Collapse>
            </StyledAttributeCard>
        </Grid>
    );
};

export default TemplateAttribute;
