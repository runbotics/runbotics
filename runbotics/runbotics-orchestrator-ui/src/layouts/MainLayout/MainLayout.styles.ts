import { HEADER_HEIGHT, NAVBAR_MOBILE_WIDTH, NAVBAR_WIDTH } from 'src/utils/constants';
import styled from 'styled-components';

interface MainProps {
    mobile?: boolean;
    showMenu: boolean;
}

const getNavbarWidth = ({ mobile, showMenu }: MainProps) => {
    if (mobile) return showMenu ? NAVBAR_WIDTH : 0;

    return showMenu ? NAVBAR_WIDTH : NAVBAR_MOBILE_WIDTH;
};

// eslint-disable no-nested-ternary
export const Main = styled.main<MainProps>`
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    padding-top: ${HEADER_HEIGHT}px;
    padding-left: ${getNavbarWidth}px;
    transition: padding 0.3s ease-in-out;
    overflow: hidden;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex: 1 1 auto;
    overflow: hidden;
`;

export const Content = styled.div`
    flex: 1 1 auto;
    overflow: auto;
`;
