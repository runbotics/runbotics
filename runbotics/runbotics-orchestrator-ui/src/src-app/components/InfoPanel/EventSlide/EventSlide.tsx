
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

export interface EventSlideProps {
    expandedEventId: number;
    onChange:  (panelId: number, isExpanded: boolean) => void;
    processInstanceEvent: IProcessInstanceEvent;
    onRefChange: (ref: HTMLDivElement) => void;
    shouldReScroll: boolean;
    container: HTMLDivElement;
}

const EventSlide: FC<EventSlideProps> = ({
    expandedEventId,
    onChange,
    processInstanceEvent,
    onRefChange,
    shouldReScroll,
    container
}) => (
    <Slide
        direction="left"
        in={Boolean(processInstanceEvent)}
        container={container}
        key={processInstanceEvent.id}
        {...(shouldReScroll
            ? { ref: onRefChange }
            : {})}
    >
        <RoundedAccordion
            expanded={expandedEventId === processInstanceEvent.id}
            onChange={(_, expanded) => onChange(processInstanceEvent.id, expanded)}
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
export default EventSlide;
