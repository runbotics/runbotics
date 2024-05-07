import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

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

const CredentialsHeader = () => {
    const { translate } = useTranslations();
    const credentials = [];

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <StyledTypography variant="h5" color="textPrimary">
                {translate('Credentials.List.Header.Elements', { count: credentials.length })}
            </StyledTypography>
            <Box display="flex" alignItems="center" flexGrow="1" justifyContent="flex-end" gap="1rem">
                {/* <If condition={displayMode === ProcessListDisplayMode.GRID}>
                    <TextField
                        id="outlined-search"
                        label={translate('Bot.Collection.Header.Search.Label')}
                        onChange={onSearchChange}
                        value={search}
                        size="small"
                        sx={{ width: '30%' }}
                    />
                </If>
                <If condition={displayTableListView}>
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
                </If> */}
            </Box>
        </Box>
    );
};

export default CredentialsHeader;
