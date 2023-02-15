import { forwardRef } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, Slide } from '@mui/material';

import { IProcessInstanceEvent } from 'runbotics-common';

import useForwardRef from '#src-app/hooks/useForwardRef';

import {
    AccordionHeader,
    ProcessInstanceEventsDetailsHeader,
    ProcessInstanceEventsDetailsTable,
    RoundedAccordion,
} from '../ProcessInstanceEventsDetails';

export interface EventSlideProps {
    expandedEventId: number;
    onChange: (
        panelId: number
    ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    processInstanceEvent: IProcessInstanceEvent;
    onRefChange: (ref: HTMLDivElement) => void;
    shouldReScroll: boolean;
}

// eslint-disable-next-line react/display-name
const EventSlide = forwardRef<HTMLDivElement, EventSlideProps>(({
    expandedEventId,
    onChange,
    processInstanceEvent,
    onRefChange,
    shouldReScroll,
}, ref) => {
    const containerRef = useForwardRef(ref);
    return(
        <Slide
            direction="left"
            in={Boolean(processInstanceEvent)}
            container={containerRef.current}
            key={processInstanceEvent.id}
            {...(shouldReScroll
                ? { ref: onRefChange }
                : {})}
        >
            <RoundedAccordion
                expanded={expandedEventId === processInstanceEvent.id}
                onChange={onChange(processInstanceEvent.id)}
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
    ); });
export default EventSlide;
