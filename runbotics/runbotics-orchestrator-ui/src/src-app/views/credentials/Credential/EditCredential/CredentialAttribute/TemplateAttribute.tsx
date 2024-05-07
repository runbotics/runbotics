import { FC, useEffect, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import { Typography, Grid, Button, Fade, Divider } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';

import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';


import { AttributeIcon, AttributeInfoNotEdiable, StyledAttributeCard, StyledGridContainer } from './Attribute.styles';
import { DisplayAttribute, EditAtributeDto } from './Attribute.types';
import CredentialDetails from '../CredentialDetails/CredentialDetails';

type TemplateAttributeProps = {
    attribute: DisplayAttribute;
    setAttribute(currentAttribute: EditAtributeDto): void;
};

const TemplateAttribute: FC<TemplateAttributeProps> = ({ attribute, setAttribute}) => {
    const { translate } = useTranslations();
    const isNewAttribute = attribute.id === undefined;
    const [isEditMode, setIsEditMode] = useState(isNewAttribute);
    const [currentAttribute, setCurrentAttribute] = useState(attribute);

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

    return (
        <Grid item spacing={2}>
            <StyledAttributeCard>
                <StyledGridContainer container rowSpacing={2}>
                    <Grid item xs={6} alignSelf='center'>
                        <If condition={attribute.required}>
                            <Label color='error'>{translate('Credential.Attribute.Tag.Required')}</Label>
                        </If>
                        <If condition={!attribute.required}>
                            <Label color='info'>{translate('Credential.Attribute.Tag.Optional')}</Label>
                        </If>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignSelf: 'center'}}>
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
                    <Grid item xs={12}>
                        <Typography variant="h6">{translate('Credential.Attribute.Name.Label')}</Typography>
                        <AttributeInfoNotEdiable>{attribute.name}</AttributeInfoNotEdiable>
                    </Grid>
                    <Grid item xs={12} marginBottom="16px">
                        <Typography variant="h6">{translate('Credential.Attribute.Description.Label')}</Typography>
                        <AttributeInfoNotEdiable>{attribute.description}</AttributeInfoNotEdiable>
                    </Grid>
                </StyledGridContainer>
                <Collapse in={isEditMode} orientation="vertical" sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                        <CredentialDetails currentAttribute={currentAttribute} handleFieldChange={handleFieldChange} />
                        <StyledGridContainer container justifyContent="space-between" sx={{ marginBottom: 0 }}>
                            <Grid item>
                                <Button size="small" onClick={handleCancel} sx={{ padding: 0, color: grey[600]}}>
                                    <AttributeIcon>
                                        <ClearIcon/>
                                    </AttributeIcon>
                                    <Typography variant="h5">
                                        {translate('Credential.Attribute.Edit.Cancel').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button size="small" color="secondary" onClick={handleConfirm} sx={{ padding: '0 8px 0 0'}}>
                                    <AttributeIcon color='inherit'>
                                        <DoneIcon />
                                    </AttributeIcon>
                                    <Typography variant="h5">{translate('Credential.Attribute.Edit.Confirm').toUpperCase() }</Typography>
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
