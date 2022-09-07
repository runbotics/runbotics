import React, { ChangeEvent, VFC } from 'react';
import {
    Box, Typography, ToggleButton, ToggleButtonGroup, TextField,
} from '@mui/material';
import styled from 'styled-components';
import Toc from '@mui/icons-material/Toc';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import If from 'src/components/utils/If';
import { ProcessListDisplayMode } from '../ProcessList.utils';
import useTranslations from 'src/hooks/useTranslations';

const StyledTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',
    '&:after': {
        position: 'absolute',
        bottom: -8,
        left: 0,
        content: '" "',
        height: 3,
        width: 48,
        backgroundColor: theme.palette.primary.main,
    },
}));

interface ProcessListHeaderProps {
    processesLength: number;
    displayMode: ProcessListDisplayMode;
    search: string;
    onDisplayModeChange: (mode: ProcessListDisplayMode) => void;
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ProcessListHeader: VFC<ProcessListHeaderProps> = ({
    displayMode, onDisplayModeChange, processesLength, search, onSearchChange,
}) => {
    const { translate } = useTranslations();
    
    return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
        <StyledTypography variant="h5" color="textPrimary">
        {translate('Process.List.Header.Showing', { count: processesLength })}
        </StyledTypography>
        <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem">
            <If condition={displayMode === ProcessListDisplayMode.GRID}>
                <TextField
                    id="outlined-search"
                    label="Search"
                    onChange={onSearchChange}
                    value={search}
                    size="small"
                    sx={{ width: '30%' }}
                />
            </If>
            <ToggleButtonGroup
                exclusive
                onChange={(_, mode) => onDisplayModeChange(mode)}
                size="small"
                value={displayMode}
            >
                <ToggleButton value={ProcessListDisplayMode.GRID}>
                    <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value={ProcessListDisplayMode.LIST}>
                    <Toc />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    </Box>
)}

export default ProcessListHeader;
