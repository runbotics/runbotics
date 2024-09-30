import { FC, useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Grid, Popover, Typography, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledGridContainer } from './Attribute.styles';
import { EditAtributeDto } from './Attribute.types';
import { PopoverTypography } from '../EditCredential.styles';

interface CredentialAttributeDetailsProps {
    handleFieldChange: (value: string) => void;
    currentAttribute: EditAtributeDto;
    isEditMode: boolean;
}

const CredentialAttributeDetails: FC<CredentialAttributeDetailsProps> = ({ handleFieldChange, currentAttribute, isEditMode }) => {
    const { translate } = useTranslations();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [maskValue, setMaskValue] = useState(currentAttribute.masked);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleClickShowValue = () => setMaskValue(mask => !mask);

    const handleMouseDownValue = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpValue = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <StyledGridContainer spacing={1} xs={12}>
            <Grid item xs={12}>
                <Grid container alignItems="center">
                    <Grid item>
                        <Typography variant="h5" mt={2} mb={2}>
                            {translate('Credential.Attribute.Details.Label')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton color="secondary" onMouseEnter={event => handlePopoverOpen(event)} onMouseLeave={handlePopoverClose}>
                            <HelpOutlineOutlinedIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth disabled={!isEditMode}>
                    <InputLabel htmlFor={translate('Credential.Attribute.Value.Label')}>
                        {translate('Credential.Attribute.Value.Label')}
                    </InputLabel>
                    <OutlinedInput
                        value={isEditMode ? currentAttribute.value : '[hidden]'}
                        type={maskValue ? 'password' : 'text'}
                        onChange={e => {
                            handleFieldChange(e.target.value);
                        }}
                        label={translate('Credential.Attribute.Value.Label')}
                        endAdornment={
                            isEditMode && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle value visibility"
                                        onClick={handleClickShowValue}
                                        onMouseDown={handleMouseDownValue}
                                        onMouseUp={handleMouseUpValue}
                                    >
                                        {maskValue ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }
                    />
                </FormControl>
            </Grid>
            <Popover
                id={'mouse-over-popover'}
                sx={{ mt: 1, pointerEvents: 'none' }}
                open={!!anchorEl}
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
