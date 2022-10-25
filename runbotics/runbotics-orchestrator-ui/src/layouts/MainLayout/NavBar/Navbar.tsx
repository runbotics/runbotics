import React, { useMemo } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListSubheader, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import useTranslations from 'src/hooks/useTranslations';
import If from 'src/components/utils/If';
import NavbarList from './NavbarList';
import {
    getDrawerStyles, Wrapper, StyledIcon, StyledText,
} from './Navbar.styles';
import { Section } from './Navbar.types'
import i18n from 'i18next';
import { usePublicSections } from './usePublicSections';
import { hasFeatureKeyAccess } from 'src/components/utils/Secured';
import useAuth from 'src/hooks/useAuth';

interface NavbarProps {
    isShrinked: boolean;
    mobile: boolean;
    onMenuShowToggleChange: () => void;
    accessedSections: Section[];
}

const NavBar: FC<NavbarProps> = ({ isShrinked, mobile, onMenuShowToggleChange, accessedSections }) => {
    const location = useLocation();
    const { translate } = useTranslations();

    return (
        <Drawer sx={getDrawerStyles(mobile, isShrinked)} anchor="left" open variant="persistent">
            <Box
                height="100%"
                display="flex"
                flexDirection="column"
                sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
            >
                <Box paddingTop="1.25rem">
                    {accessedSections.map((section) => (
                        <List
                            disablePadding
                            key={section.id}
                            subheader={
                                <ListSubheader disableGutters disableSticky>
                                    {section.subheader}
                                </ListSubheader>
                            }
                        >
                            <NavbarList items={section.items} pathname={location.pathname} mobile={mobile} />
                        </List>
                    ))}
                </Box>
                <Box marginTop="auto">
                    <Wrapper>
                        <IconButton color="inherit" onClick={onMenuShowToggleChange}>
                            <StyledIcon>
                                <If condition={isShrinked} else={<ArrowForwardIcon />}>
                                    <ArrowBackIcon />
                                </If>
                            </StyledIcon>
                        </IconButton>
                        <StyledText variant="body1">{translate('Nav.Hide')}</StyledText>
                    </Wrapper>
                </Box>
            </Box>
        </Drawer>
    );
};

export default NavBar;
