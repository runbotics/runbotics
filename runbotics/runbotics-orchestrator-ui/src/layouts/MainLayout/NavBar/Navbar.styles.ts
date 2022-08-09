import { SxProps, Theme } from '@mui/material';
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
