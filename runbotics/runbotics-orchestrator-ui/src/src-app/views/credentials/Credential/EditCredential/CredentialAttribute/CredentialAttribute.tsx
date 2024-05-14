/* eslint-disable max-lines-per-function */
import React, { FC, useEffect, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import {
    Typography,
    TextField,
    Divider,
    Grid,
    Card,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Button,
    Fade,
    IconButton,
    Popover
} from '@mui/material';
import Collapse from '@mui/material/Collapse';

import { grey } from '@mui/material/colors';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { Attribute } from './CredentialAttribute.types';

const StyledGridContainer = styled(Grid)(
    ({ theme }) => `
    padding: ${theme.spacing(2)};
    margin-bottom: '8px'
`
);

type CredentialAttributeProps = {
    attribute: Attribute;
    setAttribute(currentAttribute: Attribute): void;
    deleteAttribute(attributeToDelete: Attribute): void;
};

const CredentialAttribute: FC<CredentialAttributeProps> = ({ attribute, setAttribute, deleteAttribute }) => {
    const { translate } = useTranslations();
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAttribute, setCurrentAttribute] = useState(attribute);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

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
        setAttribute(currentAttribute);
        setIsEditMode(false);
    };

    const handleFieldChange = (fieldName, value) => {
        setCurrentAttribute({ ...currentAttribute, [fieldName]: value });
    };

    const handleMaskChange = event => {
        setCurrentAttribute({ ...currentAttribute, masked: event.target.checked });
    };

    return (
        <Grid item spacing={3}>
            <Card sx={{ backgroundColor: grey[100], border: `1px solid ${grey[400]}` }}>
                <StyledGridContainer container spacing={2}>
                    <Grid item xs={6} alignSelf="center" marginBottom="8px">
                        <Grid container alignItems="center">
                            <Typography variant="h5" marginRight="4px">
                                {translate('Credential.Attribute.Label')}
                            </Typography>
                            <IconButton sx={{ color: grey[400] }} onClick={() => deleteAttribute(currentAttribute)}>
                                <DeleteOutlineOutlinedIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <If condition={!isEditMode}>
                        <Fade in={!isEditMode}>
                            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button size="small" onClick={handleEdit} sx={{ padding: 0 }}>
                                    <EditIcon sx={{ marginRight: '8px', color: grey[700] }} />
                                    <Typography variant="h5" sx={{ color: grey[700] }}>
                                        {translate('Credential.Attribute.Edit.Edit').toUpperCase()}
                                    </Typography>
                                </Button>
                            </Grid>
                        </Fade>
                    </If>
                    <Grid item xs={12}>
                        <TextField
                            disabled={!isEditMode}
                            fullWidth
                            label={translate('Credential.Attribute.Name.Label')}
                            value={currentAttribute.name}
                            onChange={e => handleFieldChange('name', e.target.value)}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            disabled={!isEditMode}
                            fullWidth
                            label={translate('Credential.Attribute.Description.Label')}
                            onChange={e => handleFieldChange('description', e.target.value)}
                            value={currentAttribute.description}
                        ></TextField>
                    </Grid>
                    <Grid item xs={12}></Grid>
                </StyledGridContainer>
                <Divider variant="middle" />
                <StyledGridContainer container marginBottom="0">
                    <Grid item xs={12} sx={{ marginBottom: '8px' }}>
                        <Grid container alignItems="center">
                            <Typography variant="h5" marginRight="4px">
                                {translate('Credential.Attribute.Details.Label')}
                            </Typography>
                            <IconButton color="secondary" 
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}
                            >
                                <HelpOutlineOutlinedIcon />
                            </IconButton>
                        </Grid>
                        <Popover
                            id="mouse-over-popover"
                            sx={{ mt: 1, pointerEvents: 'none', width: '30%' }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                        >
                            <Typography variant="h6" fontWeight={400} marginBottom={2}>
                                {translate('Credential.Attribute.Details.Info')}
                            </Typography>
                        </Popover>
                    </Grid>
                    {/* <Grid item xs={12}>
                        <Typography variant="h6" fontWeight={400} marginBottom={2}>
                            {translate('Credential.Attribute.Details.Info')}
                        </Typography>
                    </Grid> */}
                    <Grid item xs={12}>
                        <TextField
                            disabled={!isEditMode}
                            fullWidth
                            label={translate('Credential.Attribute.Value.Label')}
                            value={currentAttribute.value}
                            onChange={e => handleFieldChange('value', e.target.value)}
                            InputProps={{ type: currentAttribute.masked ? 'password' : 'text' }}
                        ></TextField>
                    </Grid>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={!isEditMode}
                                    checked={currentAttribute.masked}
                                    onChange={() => handleMaskChange(event)}
                                />
                            }
                            label={translate('Credential.Attribute.Security.MaskValue')}
                        />
                    </FormGroup>
                </StyledGridContainer>
                <Collapse in={isEditMode} orientation="vertical">
                    <StyledGridContainer container justifyContent="space-between" sx={{ marginBottom: 0 }}>
                        <Grid item>
                            <Button size="small" onClick={handleCancel}>
                                <ClearIcon sx={{ marginRight: '8px', color: grey[600] }} />
                                <Typography variant="h5" sx={{ color: grey[600] }}>
                                    {translate('Credential.Attribute.Edit.Cancel').toUpperCase()}
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button size="small" onClick={handleConfirm}>
                                <DoneIcon sx={{ marginRight: '8px' }} />
                                <Typography variant="h5">{translate('Credential.Attribute.Edit.Confirm').toUpperCase()}</Typography>
                            </Button>
                        </Grid>
                    </StyledGridContainer>
                </Collapse>
            </Card>
        </Grid>
    );
};

export default CredentialAttribute;
