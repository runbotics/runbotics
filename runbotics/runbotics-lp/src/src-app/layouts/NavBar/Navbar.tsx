import React, { FC } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Drawer, List, ListSubheader, IconButton } from '@mui/material';

import { useRouter } from 'next/router';


import If from '#src-app/components/utils/If';

import useTranslations from '#src-app/hooks/useTranslations';

import { getDrawerStyles, Wrapper, StyledIcon, StyledText } from './Navbar.styles';
import { Section } from './Navbar.types';
import NavbarList from './NavbarList';



interface NavbarProps {
    isShrank: boolean;
    mobile: boolean;
    onMenuShowToggleChange: () => void;
    accessedSections: Section[];
}

const NavBar: FC<NavbarProps> = ({ isShrank, mobile, onMenuShowToggleChange, accessedSections }) => {
    const router = useRouter();
    const { translate } = useTranslations();

    return (
        <Drawer sx={getDrawerStyles(mobile, isShrank)} anchor="left" open variant="persistent">
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
                            <NavbarList items={section.items} pathname={router.pathname} mobile={mobile} />
                        </List>
                    ))}
                </Box>
                <Box marginTop="auto">
                    <Wrapper>
                        <IconButton color="inherit" onClick={onMenuShowToggleChange}>
                            <StyledIcon>
                                <If condition={isShrank} else={<ArrowForwardIcon />}>
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
