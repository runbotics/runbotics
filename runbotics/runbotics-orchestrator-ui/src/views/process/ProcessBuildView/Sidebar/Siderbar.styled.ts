import styled from 'styled-components';
import { zIndex } from 'src/theme/zIndex';
import { drawerWidth } from 'src/components/InfoPanel/InfoPanel';

export const SidebarRoot = styled('div')(({ theme }) => `
    position: absolute,
    display: flex,
    flex-direction: column;
    top: 0,
    right: 0,
    z-index: ${zIndex.drawer + 1};
    
    margin-top: ${theme.typography.pxToRem(132)};
    
    font-family: ${theme.typography.fontFamily};
`);

export const SidebarButton = styled.button<{ selected: boolean }>(({
    theme,
    selected,
}) => `
    position: absolute;
    top: 0;
    right: ${selected ? `${drawerWidth - 20}px` : '-19px'};
    display: flex;
    flex-direction: column;
    z-index: ${zIndex.drawer + 1};
    transform: translateX(calc(-100% + 0.25rem));

    margin: ${theme.typography.pxToRem(132)} 0 ${theme.typography.pxToRem(-8)};
    padding: ${theme.typography.pxToRem(26)} ${theme.typography.pxToRem(2)};
    
    border: ${theme.typography.pxToRem(1)} solid ${theme.palette.grey[300]};
    border-radius: ${theme.typography.pxToRem(15)} 0 0 ${theme.typography.pxToRem(15)};
    border-right: none;
    background: ${selected ? theme.palette.primary.main : theme.palette.grey[100]};
    color: ${selected ? theme.palette.common.white : theme.palette.primary.main};
    font-family: ${theme.typography.fontFamily};
    
    cursor: pointer;
    transition: ${theme.transitions.create('right',
        { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen })};
    
`);

export const SidebarLabel = styled('p')(({ theme }) => `
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.body1.fontSize};

    writing-mode: vertical-lr;
    cursor: pointer;
`);
