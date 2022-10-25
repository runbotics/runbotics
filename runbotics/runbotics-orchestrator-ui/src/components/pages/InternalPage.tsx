import React, { forwardRef, HTMLProps } from 'react';
import { Container, SxProps, Theme, useMediaQuery } from '@mui/material';
import styled from 'styled-components';
import Page from './Page';

const StyledPage = styled(Page)(
    ({ theme }) => `
    background-color: ${theme.palette.background.default};
    padding-top: ${theme.spacing(3)};
    padding-bottom: ${theme.spacing(3)};
    overflow-x: auto;
    min-height: 100%;
`,
);

const getContainerProps = (shouldLimitWidth: boolean, fullWidth: boolean | undefined) => ({
    ...(shouldLimitWidth && !fullWidth && { maxWidth: '1920px' }),
});

interface InternalPageProps extends Omit<HTMLProps<HTMLDivElement>, 'ref' | 'as'> {
    title: string;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

const InternalPage = forwardRef<HTMLDivElement, InternalPageProps>(({ children, sx, fullWidth, ...rest }, ref) => {
    const matches = useMediaQuery('(min-width: 1920px)');
    console.log((ref as any)?.current.offSetTop);
    return (
        <StyledPage ref={ref} {...rest}>
            <Container maxWidth={false} sx={{ ...getContainerProps(matches, fullWidth), ...sx }}>
                {children}
            </Container>
        </StyledPage>
    );
});

export default InternalPage;
