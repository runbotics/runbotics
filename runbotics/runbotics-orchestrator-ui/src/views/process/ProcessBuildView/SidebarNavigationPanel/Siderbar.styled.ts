import styled from 'styled-components';

export const SidebarNavigationWrapper = styled('div')({
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
});

export const SidebarNavigationButton = styled('div')<{ selected: boolean }>(({ theme, selected }) => ({
    border: `${theme.typography.pxToRem(1)} solid ${theme.palette.grey[300]}`,
    borderRadius: `${theme.typography.pxToRem(15)} 0 0 ${theme.typography.pxToRem(15)}`,
    borderRight: 'none',
    width: 'calc(1.5em)',
    padding: `${theme.typography.pxToRem(26)} ${theme.typography.pxToRem(2)}`,
    background: selected ? theme.palette.primary.main : theme.palette.grey[100],
    color: selected ? theme.palette.common.white : theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    transition: theme.transitions.create('right', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    cursor: 'pointer',
    writingMode: 'vertical-lr',
}));
