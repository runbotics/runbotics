import { Accordion, AccordionSummary, Grid } from '@mui/material';
import styled from 'styled-components';

export const AccordionHeader = styled(AccordionSummary)`
    .MuiAccordionSummary-content {
        margin: 0;
        padding: 10px 0;
    }
`;

export const RoundedAccordion = styled(Accordion)`
    &&& {
        border-radius: 4px;
        :before {
            display: none;
        }
    }
`;

export const GridContainer = styled(Grid).attrs({ container: true })`
    &&& {
        margin: 0;
        row-gap: 10px;
        column-gap: 16px;
    }
`;

export const GridItem = styled(Grid).attrs({ item: true })`
    &&& {
        padding-top: 0;
    }
`;
