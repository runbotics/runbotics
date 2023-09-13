import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledTypography = styled(Typography)(({ theme }) => `
    && {
        color: ${theme.palette.grey[500]};
        text-transform: lowercase;
        user-select: none;
        padding-left: 8px;
    }
`);

export const StyledExpandIcon = styled(ExpandMoreIcon)
    <{ $isExpanded: boolean; }>(({ theme, $isExpanded }) => `
    && {
        color: ${theme.palette.grey[500]};
        transform: rotate(${$isExpanded ? '-180deg' : '0'});
        transition: 0.5s;
    }
`);

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
`;

export const TagBox = styled.div
    <{ $isExpanded: boolean; }>(({ theme, $isExpanded }) => `
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: ${$isExpanded ? '170px' : '100%'};
    min-height: 26px;
    width: 100%;
    padding: 0 10px 0 65px;
    gap: 8px;
    margin: 0;
    overflow: hidden;
    background-color: ${$isExpanded ? theme.palette.background.paper : 'transparent'};
    transition: 0.3s;
`);

export const DividerBox = styled.div
    <{ $isExpanded: boolean; }>(({ theme, $isExpanded }) => `
    margin-top: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 10px;
    background-color: ${$isExpanded ? theme.palette.background.paper : 'transparent'};
`);

export const DividerAction = styled.div(({ theme }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 14px;
    width: 70px;
    border-radius: 10px;
    transition: 0.3s;

    &:hover {
        cursor: pointer;
        background-color: ${theme.palette.grey[300]};
    }
`);

export const DividerLine = styled.div(({ theme }) => `
    width: 75%;
    height: 1px;
    margin-right: 5px;
    background-color: ${theme.palette.grey[300]};
`);

export const StaticLine = styled.div(({ theme }) => `
    width: 85%;
    height: 1px;
    margin-right: 5px;
    background-color: ${theme.palette.grey[300]};
`);
