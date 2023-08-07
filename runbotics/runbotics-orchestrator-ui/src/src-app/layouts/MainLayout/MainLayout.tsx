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
    const [isMenuShrank, setIsMenuShrank] = useState(true);
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'));
    const publicSections = usePublicSections();
    const { user } = useAuth();

    const accessedSections = useMemo(() => publicSections
        .map((publicSection) => {
            const items = publicSection.items.filter((item) =>
                item.featureKeys
                    ? hasFeatureKeyAccess(user, item.featureKeys)
                    : true
            );
            return { ...publicSection, items };
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, i18n.language]);

    const isNavBarVisible = accessedSections[0].items.length > 0;

    useAsyncEffect(() => {
        setLoaded(true);
    }, []);

    const handleMenuShowToggle = () => {
        setIsMenuShrank((prevIsMenuShrank) => !prevIsMenuShrank);
    };

    return (
        <>
            <TopBar />
            <If condition={isNavBarVisible}>
                <NavBar
                    isShrank={isMenuShrank}
                    mobile={mobile}
                    onMenuShowToggleChange={handleMenuShowToggle}
                    accessedSections={accessedSections}
                />
            </If>
            <Main
                isNavbarVisible={isNavBarVisible}
                isShrank={isMenuShrank}
                mobile={mobile}
            >
                <ContentContainer>
                    <Content>
                        <If condition={loaded} else={<LoadingScreen />}>
                            {children}
                        </If>
                    </Content>
                </ContentContainer>
            </Main>
        </>
    );
};

export default withAuthGuard({ Component: MainLayout });
