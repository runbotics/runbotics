import { FC, useState } from 'react';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Box, FormControl, InputLabel, Select, IconButton, Popover, SelectChangeEvent, FormHelperText } from '@mui/material';

import { PopoverTypography } from '../EditCredential/EditCredential.styles';

interface CreateGeneralInfoDropdownProps {
    selectLabel: string;
    selectOptions: React.JSX.Element[];
    selectedValue: string;
    tooltipText: string;
    required: boolean;
    handleChange: (event: SelectChangeEvent) => void;
    disabled: boolean;
    error: boolean;
    helperText: string;
}

const CreateGeneralInfoDropdown: FC<CreateGeneralInfoDropdownProps> = ({
    selectLabel,
    selectOptions,
    selectedValue,
    tooltipText,
    handleChange,
    required,
    disabled,
    error,
    helperText
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl fullWidth required sx={{ marginRight: '1rem' }}>
                <InputLabel id={`${selectLabel}-inputLabel`} error={error}>
                    {selectLabel}
                </InputLabel>
                <Select
                    disabled={disabled}
                    SelectDisplayProps={{ style: { display: 'flex' } }}
                    labelId={`${selectLabel}-labelId`}
                    id={`${selectLabel}-selectId`}
                    value={selectedValue}
                    label={selectLabel}
                    onChange={handleChange}
                    required={required}
                    error={error}
                >
                    {selectOptions}
                </Select>
                {error && <FormHelperText error={true}>{helperText}</FormHelperText>}
            </FormControl>
            <IconButton color="secondary" onMouseEnter={event => handlePopoverOpen(event)} onMouseLeave={handlePopoverClose}>
                <HelpOutlineOutlinedIcon color="primary" />
            </IconButton>
            <Popover
                id="mouse-over-popover"
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
                    {tooltipText}
                </PopoverTypography>
            </Popover>
        </Box>
    );
};

export default CreateGeneralInfoDropdown;
