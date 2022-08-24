import styled from 'styled-components';
import {
    SxProps, Theme, SvgIcon, Typography,
} from '@mui/material';
import { NAVBAR_MOBILE_WIDTH, NAVBAR_WIDTH, HEADER_HEIGHT } from 'src/utils/constants';

interface NavbarDrawerProps {
    mobile?: boolean;
    showMenu: boolean;
}

type NavbarDrawerStylesReturnType = (mobile: boolean, showMenu: boolean) => { [key: string]: SxProps<Theme> };

const getNavbarWidth = ({ mobile, showMenu }: NavbarDrawerProps) => {
    if (mobile) return showMenu ? NAVBAR_WIDTH : 0;

    return showMenu ? NAVBAR_WIDTH : NAVBAR_MOBILE_WIDTH;
};

export const getDrawerStyles: NavbarDrawerStylesReturnType = (mobile: boolean, showMenu: boolean) => ({
    '& .MuiPaper-root': {
        width: `${getNavbarWidth({ mobile, showMenu })}px`,
        overflowX: 'hidden',
        top: '64px',
        height: `calc(100% - ${HEADER_HEIGHT}px)`,
        zIndex: (theme) => theme.zIndex.navbar,
        transition: 'width 0.3s ease-in-out',
    },
});

export const Wrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    padding: 5px 10px;
`;

export const StyledIcon = styled(SvgIcon)`
    && {
        min-width: 24px;
        min-height: 24px;
    }
`;

export const StyledText = styled(Typography)(
    ({ theme }) => `
        && {
            font-size: 0.875rem;
            font-weight: ${theme.typography.fontWeightMedium};
        }
    `,
);
