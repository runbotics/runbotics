import { forwardRef } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    Slide,
    TableContainer,
    Typography,
} from '@mui/material';

import dynamic from 'next/dynamic';

import If from '#src-app/components/utils/If';
import useForwardRef from '#src-app/hooks/useForwardRef';
import useTranslations from '#src-app/hooks/useTranslations';

import { IterationGutter } from '#src-app/store/slices/ProcessInstanceEvent';

import {
    AccordionHeader,
    RoundedAccordion,
} from '../ProcessInstanceEventsDetails';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export interface IterationSlideProps {
    expandedEventId: number;
    onChange: (panelId: number) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    iterationGutter: IterationGutter;
    onRefChange: (ref: HTMLDivElement) => void;
    shouldReScroll: boolean;
}

// eslint-disable-next-line react/display-name
const IterationSlide = forwardRef<HTMLDivElement, IterationSlideProps>(({
    expandedEventId,
    onChange,
    iterationGutter,
    onRefChange,
    shouldReScroll,
}, ref) => {
    const { translate } = useTranslations();
    const containerRef = useForwardRef(ref);

    return (
        <Slide
            direction="left"
            in={Boolean(iterationGutter)}
            container={containerRef.current}
            key={iterationGutter.iterationNumber}
            {...(shouldReScroll
                ? { ref: onRefChange }
                : {})}
        >
            <RoundedAccordion
                expanded={expandedEventId === iterationGutter.iterationNumber}
                onChange={onChange(iterationGutter.iterationNumber)}
                TransitionProps={{ unmountOnExit: true }}
                sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}
                disableGutters
            >
                <AccordionHeader expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="button" sx={{ padding: '5px' }}>
                        {translate(
                            'Component.InfoPanel.Details.Loop.Iteration'
                        )}&nbsp;
                        {iterationGutter.iterationNumber}
                    </Typography>
                </AccordionHeader>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Accordion
                            disableGutters
                            disabled={!iterationGutter.iteratorElement}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">
                                    {translate(
                                        'Component.InfoPanel.Details.Loop.Iterator'
                                    )}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    <If condition={Boolean(iterationGutter.iteratorElement)}>
                                        <ReactJson
                                            src={{
                                                iterator: JSON.parse(
                                                    iterationGutter.iteratorElement
                                                ),
                                            }}
                                        />
                                    </If>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    </TableContainer>
                </AccordionDetails>
            </RoundedAccordion>
        </Slide>
    );
});

export default IterationSlide;
