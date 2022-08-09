import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListSubheader,
} from '@mui/material';

import useAuth from 'src/hooks/useAuth';
import { hasAccessByFeatureKey } from 'src/components/utils/Secured';
import { getPublicSections } from './Navbar.sections';
import NavbarList from './NavbarList';
import { getDrawerStyles } from './Navbar.styles';
import { Section } from './Navbar.types';

interface NavbarProps {
    showMenu: boolean;
    mobile: boolean;
}

const NavBar: FC<NavbarProps> = ({ showMenu, mobile }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [sections, setSections] = useState<Section[]>([]);

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
    }, [user]);

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
                            subheader={(
                                <ListSubheader disableGutters disableSticky>
                                    {section.subheader}
                                </ListSubheader>
                            )}
                        >
                            <NavbarList
                                items={section.items}
                                pathname={location.pathname}
                                mobile={mobile}
                            />
                        </List>
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
};

export default NavBar;
