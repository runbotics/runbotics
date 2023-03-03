import styled from 'styled-components';

import { HEADER_HEIGHT, NAVBAR_MOBILE_WIDTH, NAVBAR_WIDTH } from '#src-app/utils/constants';

interface MainProps {
    mobile?: boolean;
    isShrank: boolean;
    isNavbarVisible?: boolean;
}

const getNavbarWidth = ({ mobile, isShrank: isShrinked }: MainProps) => {
    if (mobile) return isShrinked ? NAVBAR_WIDTH : 0;

    return isShrinked ? NAVBAR_WIDTH : NAVBAR_MOBILE_WIDTH;
};

// eslint-disable no-nested-ternary
export const Main = styled.main<MainProps>`
    display: flex;
    flex: 1 1 auto;
    height: 100%;
    padding-top: ${HEADER_HEIGHT}px;
    padding-left: ${({ isNavbarVisible }) => isNavbarVisible ? getNavbarWidth : 0}px;
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
