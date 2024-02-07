import { FC, useState } from "react";
import { AccordionProps } from "./Accordion.types";
import { CustomDivider, StyledAccordion, StyledAccordionDetails, StyledAccordionSummary, StyledExpandMoreOutlinedIcon } from "./Accordion.styles";
import { Box, Typography } from "@mui/material";

const Accordion: FC<AccordionProps> = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const toggleExpand = () => (_, isOpen) => {
        setIsExpanded(isOpen);
    };

    return (
        <StyledAccordion expanded={isExpanded} onChange={toggleExpand()}>
            <StyledAccordionSummary
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Box display="flex" alignItems="center" width="100%" gap={2}>
                    <Typography variant="body1">{title}</Typography>
                    <CustomDivider hovered={isHovered} />
                    <StyledExpandMoreOutlinedIcon expanded={isExpanded} hovered={isHovered} />
                </Box>
            </StyledAccordionSummary>
            <StyledAccordionDetails expanded={isExpanded}>
                {children}
            </StyledAccordionDetails>
        </StyledAccordion>
    );
};


export default Accordion;