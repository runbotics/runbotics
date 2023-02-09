import { FC } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, Slide } from '@mui/material';

import { IProcessInstanceEvent } from 'runbotics-common';

import {
    AccordionHeader,
    ProcessInstanceEventsDetailsHeader,
    ProcessInstanceEventsDetailsTable,
    RoundedAccordion,
} from '../ProcessInstanceEventsDetails';

export interface InfoSlideProps {
    containerRef: React.RefObject<HTMLDivElement>;
    expanded: number;
    handleChange: (panelId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    index: number;
    onRefChange: (node: HTMLDivElement) => void;
    processInstanceEvent: IProcessInstanceEvent;
    processInstanceEventsLength: number;
}
    
const InfoSlide: FC<InfoSlideProps> = ({
    containerRef,
    expanded,
    handleChange,
    index,
    onRefChange,
    processInstanceEvent,
    processInstanceEventsLength,
}) => (
    <Slide
        direction="left"
        in={!!processInstanceEvent}
        container={containerRef.current}
        key={processInstanceEvent.id}
        {...(index === processInstanceEventsLength - 1
            ? { ref: onRefChange }
            : {})}
    >
        <RoundedAccordion
            expanded={expanded === processInstanceEvent.id}
            onChange={handleChange(processInstanceEvent.id)}
            TransitionProps={{ unmountOnExit: true }}
            disableGutters
        >
            <AccordionHeader expandIcon={<ExpandMoreIcon />}>
                <ProcessInstanceEventsDetailsHeader
                    processInstanceEvent={processInstanceEvent}
                />
            </AccordionHeader>
            <AccordionDetails>
                <ProcessInstanceEventsDetailsTable
                    processInstanceEvent={processInstanceEvent}
                />
            </AccordionDetails>
        </RoundedAccordion>
    </Slide>
);
export default InfoSlide;
