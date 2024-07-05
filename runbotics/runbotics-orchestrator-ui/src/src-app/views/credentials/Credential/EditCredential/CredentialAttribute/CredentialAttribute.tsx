/* eslint-disable max-lines-per-function */
/* eslint-disable react/jsx-no-undef */
import { FC, useEffect, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import {
    Typography,
    TextField,
    Grid,
    Button,
    Fade,
    IconButton,
    Divider,
    Chip,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';

import { grey } from '@mui/material/colors';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { DisplayAttribute, EditAtributeDto } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';

import { StyledAttributeCard, StyledGridContainer } from './CredentialAttribute.style';
import CredentialDetails from './CredentialDetails/CredentialDetails';
import { CredentialTemplate, CredentialTemplateNames } from '../../Credential.types';

type CredentialAttributeProps = {
    attribute: DisplayAttribute;
    template: CredentialTemplate
    setAttribute(currentAttribute: EditAtributeDto): void;
    deleteAttribute(attributeToDelete: EditAtributeDto): void;
};

const CredentialAttribute: FC<CredentialAttributeProps> = ({ attribute, setAttribute, deleteAttribute, template }) => {
    const { translate } = useTranslations();
    const isNewAttribute = attribute.id === undefined;
    const [isEditMode, setIsEditMode] = useState(isNewAttribute);
    const [currentAttribute, setCurrentAttribute] = useState(attribute);
    const isCustom = template.name === CredentialTemplateNames.CUSTOM;

    useEffect(() => {
        setCurrentAttribute(attribute);
    }, [attribute]);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setCurrentAttribute(attribute);
        setIsEditMode(false);
    };

    const handleConfirm = () => {
        const updatedAttribute: EditAtributeDto = {
            id: currentAttribute.id,
            name: currentAttribute.name,
            masked: true,
            value: currentAttribute.value,
            description: currentAttribute.description
        };
        setAttribute(updatedAttribute);
        setIsEditMode(false);
    };

    const handleFieldChange = (fieldName, value) => {
        setCurrentAttribute({ ...currentAttribute, [fieldName]: value });
    };

    // const handleMaskChange = event => {
    //     setCurrentAttribute({ ...currentAttribute, masked: event.target.checked });
    // };

    return (
        <Grid item spacing={2}>
            <StyledAttributeCard>
                <StyledGridContainer container rowSpacing={2}>
                    <If condition={!isCustom}>
                        <Grid item xs={12}>
                            <If condition={attribute.required}><Chip label='REQUIRED' color='warning'></Chip>
                            </If>
                            <If condition={!attribute.required}><Chip label='OPTIONAL' color="info"></Chip>
                            </If>
                        </Grid>
                    </If>
                    <Grid item xs={6} alignSelf="center">
                        <Grid container alignItems="center" marginBottom="8px">
                            <Grid item>
                                <Typography variant="h5">
                                    {translate('Credential.Attribute.Label')}
                                </Typography>
                            </Grid>
                            <If condition={isCustom}>
                                <Grid item>
                                    <IconButton sx={{ color: grey[400]}} onClick={() => deleteAttribute(currentAttribute as EditAtributeDto)}>
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                </Grid>
                            </If>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <If condition={!isEditMode}>
                            <Fade in={!isEditMode}>
                                <Button size="small" onClick={handleEdit} sx={{ marginRight: '4px' }}>
                                    <EditIcon sx={{ marginRight: '8px', color: grey[700] }} />
                                    <Typography variant="h5" sx={{ color: grey[700]}}>
                                        {translate('Credential.Attribute.Edit.Edit').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Fade>
                        </If>
                    </Grid>
                    <Grid item xs={12}>
                        <If condition={!isCustom}>
                            <Typography>{attribute.name}</Typography>
                        </If>
                        <If condition={isCustom}>
                            <TextField
                                disabled={!isEditMode}
                                fullWidth
                                label={translate('Credential.Attribute.Name.Label')}
                                value={currentAttribute.name}
                                onChange={e => handleFieldChange('name', e.target.value)}
                            ></TextField>
                        </If>
                    </Grid>
                    <Grid item xs={12} marginBottom="16px">
                        <TextField
                            disabled={!isEditMode}
                            fullWidth
                            label={translate('Credential.Attribute.Description.Label')}
                            onChange={e => handleFieldChange('description', e.target.value)}
                            value={currentAttribute.description}
                        ></TextField>
                    </Grid>
                </StyledGridContainer>
                <Collapse in={isEditMode} orientation="vertical" sx={{width: '100%'}}>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                        <CredentialDetails currentAttribute={currentAttribute} handleFieldChange={handleFieldChange}/>
                        <StyledGridContainer container justifyContent="space-between" sx={{ marginBottom: 0 }}>
                            <Grid item>
                                <Button size="small" onClick={handleCancel} sx={{padding: 0}}>
                                    <ClearIcon sx={{ marginRight: '8px', color: grey[600] }} />
                                    <Typography variant="h5" sx={{ color: grey[600] }}>
                                        {translate('Credential.Attribute.Edit.Cancel').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button size="small" color="secondary" onClick={handleConfirm} sx={{padding: 0}}>
                                    <DoneIcon sx={{ marginRight: '8px' }} />
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

export default CredentialAttribute;
