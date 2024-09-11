import { useState } from 'react';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Grid, Popover, Typography, IconButton, TextField } from '@mui/material';


import useTranslations from '#src-app/hooks/useTranslations';

import { StyledGridContainer } from '../CredentialAttribute/Attribute.styles';
import { PopoverTypography } from '../EditCredential.styles';

const CredentialAttributeDetails = ({ handleFieldChange, currentValue, setCurrentValue }) => {
    const { translate } = useTranslations();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <StyledGridContainer spacing={1} xs={12}>
            <Grid item xs={12}>
                <Grid container alignItems="center" >
                    <Grid item>
                        <Typography variant="h5" mt={2} mb={2}>
                            {translate('Credential.Attribute.Details.Label')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton
                            color="secondary"
                            onMouseEnter={event => handlePopoverOpen(event)}
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
                    value={currentValue}
                    onClick={() => setCurrentValue('')}
                    onChange={e => {
                        handleFieldChange(e.target.value);
                        setCurrentValue(e.target.value);
                    }}
                    InputProps={{ type: 'password' }}
                ></TextField>
            </Grid>
            <Popover
                id={'mouse-over-popover'}
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
                <PopoverTypography variant="h6" fontWeight={400}>
                    {translate('Credential.Attribute.Details.Info')}
                </PopoverTypography>
            </Popover>
        </StyledGridContainer>
     
    );
};

export default CredentialAttributeDetails;
