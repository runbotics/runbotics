import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chip, Typography } from '@mui/material';
import styled from 'styled-components';

export const StyledChipName = styled(Chip)`
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

export const StyledExpandIcon = styled(ExpandMoreIcon)<{ isExpanded: boolean; }>`
    && {
        position: relative;
        top: 10px;
        color: ${props => props.theme.palette.grey[500]};
        transform: rotate(${props => props.isExpanded ? '-180deg' : '0'});
        transition: 0.5s;
    }
`;

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    top: -8px;
    height: 20px;
`;

export const TagBox = styled.div<{ isHidden: boolean; }>`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    height: ${props => props.isHidden ? '130%' : '170px'};
    min-height: 26px;
    width: 100%;
    padding: 0 10px 0 65px;
    margin: 0;
    z-index: 3;
    isolation: isolate;
    overflow: hidden;
    background-color: ${props => props.theme.palette.background.paper};
    transition: 0.3s;
`;

export const DividerBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 10px;
    z-index: 3;
    isolation: isolate;
    background-color: ${props => props.theme.palette.background.paper};
`;

export const DividerAction = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;

    &:hover {
        cursor: pointer;
    }
`;

export const DividerLine = styled.div`
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
