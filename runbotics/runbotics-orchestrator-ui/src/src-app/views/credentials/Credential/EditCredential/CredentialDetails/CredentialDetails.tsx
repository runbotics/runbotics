import { useState } from 'react';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Grid, Popover, Typography, IconButton, TextField } from '@mui/material';

import { grey } from '@mui/material/colors';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledGridContainer } from '../CredentialAttribute/Attribute.styles';

const CredentialDetails = ({ currentAttribute, handleFieldChange }) => {
    const { translate } = useTranslations();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, attributeId) => {
        setAnchorEl(event.currentTarget);
        setHoveredIndex(attributeId);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <StyledGridContainer spacing={1} xs={12}>
            <Grid item xs={12} sx={{ marginBottom: '24px' }}>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography variant="h5">
                            {translate('Credential.Attribute.Details.Label')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            color="secondary"
                            onMouseEnter={event => handlePopoverOpen(event, currentAttribute.id)}
                            onMouseLeave={handlePopoverClose}
                        >
                            <HelpOutlineOutlinedIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label={translate('Credential.Attribute.Value.Label')}
                    value="masked"
                    onChange={e => handleFieldChange('value', e.target.value)}
                    InputProps={{ type: currentAttribute.masked ? 'password' : 'text' }}
                ></TextField>
            </Grid>
            <Popover
                id={`mouse-over-popover-${currentAttribute.id}`}
                sx={{ mt: 1, pointerEvents: 'none' }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography variant="h6" fontWeight={400} maxWidth="240px" padding="8px" sx={{ backgroundColor: grey[50] }}>
                    {translate('Credential.Attribute.Details.Info')}
                </Typography>
            </Popover>
        </StyledGridContainer>
     
    );
};

export default CredentialDetails;
