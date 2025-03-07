import { FC, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { CustomDivider, StyledAccordion, StyledAccordionDetails, StyledAccordionSummary, StyledExpandMoreOutlinedIcon } from './Accordion.styles';
import { AccordionProps } from './Accordion.types';

const Accordion: FC<AccordionProps> = ({ title, children, defaultExpanded = false, props }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const [isHovered, setIsHovered] = useState(false);

    const toggleExpand = () => (_, isOpen) => {
        setIsExpanded(isOpen);
    };

    return (
        <StyledAccordion $expanded={isExpanded} onChange={toggleExpand()} expanded={isExpanded} {...props}>
            <StyledAccordionSummary
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box display="flex" alignItems="center" width="100%" gap={2}>
                    <Typography variant="body1">{title}</Typography>
                    <CustomDivider $hovered={isHovered} />
                    <StyledExpandMoreOutlinedIcon $expanded={isExpanded} $hovered={isHovered} />
                </Box>
            </StyledAccordionSummary>
            <StyledAccordionDetails $expanded={isExpanded} >
                {children}
            </StyledAccordionDetails>
        </StyledAccordion>
    );
};


export default Accordion;
