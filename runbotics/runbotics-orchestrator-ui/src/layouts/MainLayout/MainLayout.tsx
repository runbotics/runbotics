import React, { useState } from 'react';
import type { FC } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import useAsyncEffect from 'src/hooks/useAsyncEffect';
import LoadingScreen from 'src/components/utils/LoadingScreen';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { Main, ContentContainer, Content } from './MainLayout.styles';

const MainLayout: FC = ({ children }) => {
    const [loaded, setLoaded] = useState(false);
    const [showMenu, setShowMenu] = useState(true);
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down('md'));

    useAsyncEffect(() => {
        setLoaded(true);
    }, []);

    const handleMenuShowToggle = () => {
        setShowMenu((prevshowMenu) => !prevshowMenu);
    };

    return (
        <>
            <TopBar />
            <NavBar showMenu={showMenu} mobile={mobile} onMenuShowToggleChange={handleMenuShowToggle} />
            <Main showMenu={showMenu} mobile={mobile}>
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
