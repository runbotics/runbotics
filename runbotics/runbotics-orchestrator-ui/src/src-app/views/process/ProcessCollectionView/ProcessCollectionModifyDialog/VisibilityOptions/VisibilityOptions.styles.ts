import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import styled from 'styled-components';

export const StyledAccordion = styled(Accordion)`
    && {
        border-radius: 5px;
        display: flex;
        flex-direction: column;

        ::before {
            display: none;
        }
    }
`;

export const StyledAccordionDetails = styled(AccordionDetails)`
    && {
        display: flex;
        flex-direction: column;
    }
`;

export const StyledAccordionSummary = styled(AccordionSummary)``;
