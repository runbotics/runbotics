import React, { FC, useState } from 'react';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Box, FormControl, InputLabel, Select, IconButton, Popover, Typography, SelectChangeEvent } from '@mui/material';
import { grey } from '@mui/material/colors';

interface GeneralInfoDropdownProps {
    selectLabel: string;
    selectOptions: React.JSX.Element[];
    selectedValue: string;
    tooltipText: string;
    required: boolean;
    handleChange(event: SelectChangeEvent): void;
    
}

const GeneralInfoDropdown: FC<GeneralInfoDropdownProps> = ({ selectLabel, selectOptions, selectedValue, tooltipText, handleChange, required }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    console.log(selectedValue);

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl fullWidth required sx={{ marginRight: '1rem' }}>
                <InputLabel id="collection_color">{selectLabel}</InputLabel>
                <Select
                    SelectDisplayProps={{ style: { display: 'flex' } }}
                    labelId="collection-label"
                    id="collection-select"
                    value={selectedValue}
                    label="Collection"
                    onChange={handleChange}
                    required={required}
                >
                    {selectOptions}
                </Select>
            </FormControl>
            <IconButton color="secondary" onMouseEnter={event => handlePopoverOpen(event)} onMouseLeave={handlePopoverClose}>
                <HelpOutlineOutlinedIcon color="primary" />
            </IconButton>
            <Popover
                id="mouse-over-popover"
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
                    {tooltipText}
                </Typography>
            </Popover>
        </Box>
    );
};

export default GeneralInfoDropdown;
