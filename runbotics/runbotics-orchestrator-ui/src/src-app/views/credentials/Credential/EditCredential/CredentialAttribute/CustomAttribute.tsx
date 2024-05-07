import { FC, useEffect, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';

import { Typography, TextField, Grid, Button, Fade, IconButton, Divider } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { grey } from '@mui/material/colors';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { AttributeIcon, StyledCustomAttributeCard, StyledGridContainer } from './Attribute.styles';
import { DisplayAttribute, EditAtributeDto } from './Attribute.types';
import CredentialDetails from '../CredentialDetails/CredentialDetails';

type CustomAttributeProps = {
    attribute: DisplayAttribute;
    setAttribute(currentAttribute: EditAtributeDto): void;
    deleteAttribute(attributeToDelete: EditAtributeDto): void;
};

const CustomAttribute: FC<CustomAttributeProps> = ({ attribute, setAttribute, deleteAttribute }) => {
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
            <StyledCustomAttributeCard>
                <StyledGridContainer container rowSpacing={2}>
                    <Grid item xs={6} alignSelf="center">
                        <Grid container alignItems="center" marginBottom="8px">
                            <Grid item>
                                <Typography variant="h5">{translate('Credential.Attribute.Label')}</Typography>
                            </Grid>
                            <Grid item>
                                <IconButton sx={{ color: grey[400] }} onClick={() => deleteAttribute(currentAttribute as EditAtributeDto)}>
                                    <DeleteOutlineOutlinedIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <If condition={!isEditMode}>
                            <Fade in={!isEditMode}>
                                <Button size="small" onClick={handleEdit} sx={{ marginRight: '4px' }}>
                                    <AttributeIcon>
                                        <EditIcon sx={{ color: grey[700] }} />
                                    </AttributeIcon>
                                    <Typography variant="h5" sx={{ color: grey[700] }}>
                                        {translate('Credential.Attribute.Edit.Edit').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Fade>
                        </If>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={!isEditMode}
                            fullWidth
                            label={translate('Credential.Attribute.Name.Label')}
                            value={currentAttribute.name}
                            onChange={e => handleFieldChange('name', e.target.value)}
                        ></TextField>
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
                <Collapse in={isEditMode} orientation="vertical" sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                        <Divider variant="middle" />
                        <CredentialDetails currentAttribute={currentAttribute} handleFieldChange={handleFieldChange} />
                        <StyledGridContainer container justifyContent="space-between">
                            <Grid item>
                                <Button size="small" onClick={handleCancel} sx={{ padding: 0 }}>
                                    <AttributeIcon>
                                        <ClearIcon sx={{ color: grey[600] }} />
                                    </AttributeIcon>
                                    <Typography variant="h5" sx={{ color: grey[600] }}>
                                        {translate('Credential.Attribute.Edit.Cancel').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button size="small" color="secondary" onClick={handleConfirm} sx={{ padding: 0 }}>
                                    <AttributeIcon color='inherit'>
                                        <DoneIcon/>
                                    </AttributeIcon>
                                    <Typography variant="h5">{translate('Credential.Attribute.Edit.Confirm').toUpperCase()}</Typography>
                                </Button>
                            </Grid>
                        </StyledGridContainer>
                    </Grid>
                </Collapse>
            </StyledCustomAttributeCard>
        </Grid>
    );
};

export default CustomAttribute;
