import { useState, useMemo, FC } from 'react';

import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import i18n from 'i18next';

import { withAuthGuard } from '#src-app/components/guards/AuthGuard';
import If from '#src-app/components/utils/If';
import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAsyncEffect from '#src-app/hooks/useAsyncEffect';
import useAuth from '#src-app/hooks/useAuth';

import { Main, ContentContainer, Content } from './MainLayout.styles';
import NavBar from './NavBar';
import { usePublicSections } from './NavBar/usePublicSections';
import TopBar from './TopBar';

const MainLayout: FC = ({ children }) => {
    const [loaded, setLoaded] = useState(false);
    const [isMenuShrinked, setIsMenuShrinked] = useState(true);
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'));
    const publicSections = usePublicSections();
    const { user } = useAuth();

    const accessedSections = useMemo(
        () =>
            publicSections.map((accessToSection) => {
                const items = accessToSection.items.filter((item) =>
                    item.featureKeys
                        ? hasFeatureKeyAccess(user, item.featureKeys)
                        : true
                );
                return { ...accessToSection, items };
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, i18n.language]
    );

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
                <NavBar
                    isShrinked={isMenuShrinked}
                    mobile={mobile}
                    onMenuShowToggleChange={handleMenuShowToggle}
                    accessedSections={accessedSections}
                />
            </If>
            <Main
                isNavbarVisible={isNavBarVisible}
                isShrinked={isMenuShrinked}
                mobile={mobile}
            >
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

export default withAuthGuard(MainLayout);
