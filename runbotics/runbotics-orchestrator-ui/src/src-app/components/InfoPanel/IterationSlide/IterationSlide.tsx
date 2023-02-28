import { FC } from 'react';

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

import useTranslations from '#src-app/hooks/useTranslations';

import { IterationGutter } from '#src-app/store/slices/ProcessInstanceEvent';

import {
    AccordionHeader,
    RoundedAccordion,
} from '../ProcessInstanceEventsDetails';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export interface IterationSlideProps {
    expandedEventId: number;
    onChange: (panelId: number, isExpanded: boolean) => void;
    iterationGutter: IterationGutter;
    container: HTMLDivElement;
}

const IterationSlide: FC<IterationSlideProps> = ({
    expandedEventId,
    onChange,
    iterationGutter,
    container
}) => {
    const { translate } = useTranslations();
    return (
        <Slide
            direction="left"
            in={Boolean(iterationGutter)}
            container={container}
            key={iterationGutter.iterationNumber}
        >
            <RoundedAccordion
                expanded={expandedEventId === iterationGutter.iterationNumber}
                onChange={(_, expanded) =>
                    onChange(iterationGutter.iterationNumber, expanded)
                }
                TransitionProps={{ unmountOnExit: true }}
                sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}
                disableGutters
            >
                <AccordionHeader expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="button" sx={{ padding: '5px' }}>
                        {translate(
                            'Component.InfoPanel.Details.Loop.Iteration'
                        )}
                        &nbsp;
                        {iterationGutter.iterationNumber}
                    </Typography>
                </AccordionHeader>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Accordion
                            disableGutters
                            disabled={!iterationGutter.iteratorElement}
                            defaultExpanded={Boolean(
                                iterationGutter.iteratorElement
                            )}
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
                                    {iterationGutter.iteratorElement && (
                                        <ReactJson
                                            src={{
                                                iterator: 
                                                    iterationGutter.iteratorElement
                                            }}
                                        />
                                    )}
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    </TableContainer>
                </AccordionDetails>
            </RoundedAccordion>
        </Slide>
    );
};

export default IterationSlide;
