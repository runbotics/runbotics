import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chip, Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledChip = styled(Chip)`
    margin: 0 8px 8px 0;
`;

export const StyledTypography = styled(Typography)(({ theme }) => `
    && {
        color: ${theme.palette.grey[500]};
        text-transform: lowercase;
        position: relative;
        top: 7px;
        user-select: none;

        &:hover {
            cursor: pointer;
        }
    }
`);

export const StyledMoreIcon = styled(ExpandMoreIcon)(({ theme }) => `
    && {
        position: relative;
        top: 10px;
        color: ${theme.palette.grey[500]};
    }
`);

export const StyledLessIcon = styled(ExpandLessIcon)(({ theme }) => `
    && {
        position: relative;
        top: 10px;
        color: ${theme.palette.grey[500]};
    }
`);

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    top: -8px;
    height: 20px;
`;

export const TagBox = styled.div<{ hidden: boolean; }>`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: ${props => props.hidden ? '130%' : '170px'};
    min-height: 26px;
    width: 100%;
    padding: 0 10px 0 65px;
    margin: 0;
    z-index: 3;
    overflow: hidden;
    background-color: ${props => props.theme.palette.background.paper};
    transition: 0.3s;
`;

export const ExpandBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 10px;
    z-index: 3;
    background-color: ${props => props.theme.palette.background.paper};
`;

export const ExpandAction = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;

    &:hover {
        cursor: pointer;
    }
`;

export const ExpandLine = styled.div`
    width: 75%;
    height: 1px;
    margin-right: 5px;
    background-color: ${props => props.theme.palette.grey[300]};
`;

export const StaticLine = styled.div`
    width: 90%;
    height: 1px;
    margin-right: 5px;
    background-color: ${props => props.theme.palette.grey[300]}
`;
