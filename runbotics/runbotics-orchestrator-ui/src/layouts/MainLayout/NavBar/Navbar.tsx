import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListSubheader, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import useAuth from 'src/hooks/useAuth';
import useTranslations from 'src/hooks/useTranslations';
import { hasAccessByFeatureKey } from 'src/components/utils/Secured';
import If from 'src/components/utils/If';
import { getPublicSections } from './Navbar.sections';
import NavbarList from './NavbarList';
import {
    getDrawerStyles, Wrapper, StyledIcon, StyledText,
} from './Navbar.styles';
import { Section } from './Navbar.types';
import moment from 'moment'

interface NavbarProps {
    showMenu: boolean;
    mobile: boolean;
    onMenuShowToggleChange: () => void;
}

const NavBar: FC<NavbarProps> = ({ showMenu, mobile, onMenuShowToggleChange }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [sections, setSections] = useState<Section[]>([]);
    const { translate } = useTranslations();

    const preparePublicSections = async () => {
        const publicSections = await getPublicSections();
        const accessToSections = publicSections;

        for (const accessToSection of accessToSections) {
            accessToSection.items = accessToSection.items.filter((item) => {
                if (item.featureKeys) {
                    return hasAccessByFeatureKey(user, item.featureKeys);
                }
                return true;
            });
        }
        setSections(accessToSections);
    };

    useEffect(() => {
        preparePublicSections();
    }, [user, moment.locale()]); 

    return (
        <Drawer sx={getDrawerStyles(mobile, showMenu)} anchor="left" open variant="persistent">
            <Box
                height="100%"
                display="flex"
                flexDirection="column"
                sx={{ backgroundColor: (theme) => theme.palette.grey[100] }}
            >
                <Box paddingTop="1.25rem">
                    {sections.map((section) => (
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
                                <If condition={showMenu} else={<ArrowForwardIcon />}>
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
