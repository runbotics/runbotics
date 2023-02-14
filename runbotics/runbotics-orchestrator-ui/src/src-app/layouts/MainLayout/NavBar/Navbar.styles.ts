import {
    SxProps, Theme, SvgIcon, Typography,
} from '@mui/material';
import styled from 'styled-components';

import { NAVBAR_MOBILE_WIDTH, NAVBAR_WIDTH, HEADER_HEIGHT } from '#src-app/utils/constants';

interface NavbarDrawerProps {
    mobile?: boolean;
    isShrank: boolean;
}

type NavbarDrawerStylesReturnType = (mobile: boolean, isShrank: boolean) => { [key: string]: SxProps<Theme> };

const getNavbarWidth = ({ mobile, isShrank }: NavbarDrawerProps) => {
    if (mobile) return isShrank ? NAVBAR_WIDTH : 0;

    return isShrank ? NAVBAR_WIDTH : NAVBAR_MOBILE_WIDTH;
};

export const getDrawerStyles: NavbarDrawerStylesReturnType = (mobile: boolean, isShrank: boolean) => ({
    '& .MuiPaper-root': {
        width: `${getNavbarWidth({ mobile, isShrank: isShrank })}px`,
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
