import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import styled from 'styled-components';

import { StyledExpandProps, StyledHoverProps, StyledIconProps } from './Accordion.types';

export const StyledAccordion = styled(Accordion) <StyledExpandProps>`
    && {
        display: flex;
        flex-direction: column;

        padding: 0;

        box-shadow: none;

        ::before {
            display: none;
        }
    }
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
    && {
        position: relative;
        padding: 0;

        height: 40px;
        border-radius: 7px;

        transition: 150ms;
    }
`;

export const StyledAccordionDetails = styled(AccordionDetails)<StyledExpandProps>`
    opacity: ${({ expanded }) => expanded ? 1 : 0};

    transition: opacity 300ms ease;
`;

export const CustomDivider = styled.div<StyledHoverProps>`
    position: relative;

    height: 1px;
    width: 100%;

    background-color: ${({ theme }) => theme.palette.divider};

    ::after {
        content: '';

        position: absolute;
        right: 0;

        display: block;

        width: ${({ hovered }) => hovered ? '100%' : 0};
        height: 1px;

        transition: width 200ms ease;

        background-color: ${({ theme }) => theme.palette.primary.main};
    }
`;

export const StyledExpandMoreOutlinedIcon = styled(ExpandMoreOutlinedIcon)<StyledIconProps>`
    && {
        transition: transform 200ms ease, color 300ms ease-out;

        color: ${({ theme, hovered }) => hovered ? theme.palette.primary.main : theme.palette.divider};
        transform: rotate(${(props) => (props.expanded ? '180deg' : '0deg')});
    }
`;
