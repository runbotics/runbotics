import {
    SxProps, Theme, SvgIcon, Typography,
} from '@mui/material';
import styled from 'styled-components';

import { NAVBAR_MOBILE_WIDTH, NAVBAR_WIDTH, HEADER_HEIGHT } from '#src-app/utils/constants';

interface NavbarDrawerProps {
    mobile?: boolean;
    isShrinked: boolean;
}

type NavbarDrawerStylesReturnType = (mobile: boolean, isShrinked: boolean) => { [key: string]: SxProps<Theme> };

const getNavbarWidth = ({ mobile, isShrinked }: NavbarDrawerProps) => {
    if (mobile) return isShrinked ? NAVBAR_WIDTH : 0;

    return isShrinked ? NAVBAR_WIDTH : NAVBAR_MOBILE_WIDTH;
};

export const getDrawerStyles: NavbarDrawerStylesReturnType = (mobile: boolean, isShrinked: boolean) => ({
    '& .MuiPaper-root': {
        width: `${getNavbarWidth({ mobile, isShrinked })}px`,
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
