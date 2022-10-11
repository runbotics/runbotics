import React, { useState, useMemo } from 'react';
import type { FC } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import useAsyncEffect from 'src/hooks/useAsyncEffect';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import If from 'src/components/utils/If';
import useAuth from 'src/hooks/useAuth';
import { hasAccessByFeatureKey } from 'src/components/utils/Secured';
import i18n from 'i18next';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { Main, ContentContainer, Content } from './MainLayout.styles';
import { usePublicSections } from './NavBar/usePublicSections';

const MainLayout: FC = ({ children }) => {
    const [loaded, setLoaded] = useState(false);
    const [isMenuShrinked, setIsMenuShrinked] = useState(true);
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'));
    const publicSections = usePublicSections();
    const { user } = useAuth();

    const accessedSections = useMemo(() => {
        for (const accessToSection of publicSections) {
            accessToSection.items = accessToSection.items.filter((item) => {
                if (item.featureKeys) {
                    return hasAccessByFeatureKey(user, item.featureKeys);
                }
                return true;
            });
        }

        return publicSections;
    }, [user, i18n.language]);

    const isNavBarVisible = accessedSections[0].items.length !== 1;

    useAsyncEffect(() => {
        setLoaded(true);
    }, []);

    const handleMenuShowToggle = () => {
        setIsMenuShrinked((prevIsMenuShrinked) => !prevIsMenuShrinked);
    };

    return (
        <>
            <TopBar />
            <If condition={isNavBarVisible}>
                <NavBar isShrinked={isMenuShrinked} mobile={mobile} onMenuShowToggleChange={handleMenuShowToggle} accessedSections={accessedSections} />
            </If>
            <Main isNavbarVisible={isNavBarVisible} isShrinked={isMenuShrinked} mobile={mobile}>
                <ContentContainer>
                    <Content>
                        {!loaded && <LoadingScreen />}
                        {loaded && children}
                    </Content>
                </ContentContainer>
            </Main>
        </>
    );
};

export default MainLayout;
