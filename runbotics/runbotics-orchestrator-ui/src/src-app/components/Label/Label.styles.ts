import { alpha } from '@mui/material/styles';
import styled from 'styled-components';

import { Color } from './Label';


export const Wrapper = styled.span<{ color: Color }>(({ theme, color }) => `
    font-family: ${theme.typography.fontFamily};
    align-items: center;
    border-radius: 2px;
    display: inline-flex;
    flex-grow: 0;
    white-space: nowrap;
    cursor: default;
    flex-shrink: 0;
    font-size: ${theme.typography.pxToRem(12)};
    font-weight: ${theme.typography.fontWeightMedium};
    height: 20px;
    justify-content: center;
    letter-spacing: 0.5px;
    min-width: 20px;
    padding: ${theme.spacing(0.5, 1)};
    text-transform: uppercase;
    color: ${theme.palette[color].main};
    background-color: ${alpha(theme.palette[color].main, 0.08)};
`);

export const LabelGroup = styled.div`
    display: flex;

    align-items: center;

    gap: 5px;
    `;
