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
export interface InfoSlideProps {
    containerRef: React.RefObject<HTMLDivElement>;
    expanded: number;
    handleChange: (
        panelId: number
    ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
    iterationGutter: IterationGutter;
}

const IterationSlide: FC<InfoSlideProps> = ({
    containerRef,
    expanded,
    handleChange,
    iterationGutter,
}) => {
    const { translate } = useTranslations();

    return (
        <Slide
            direction="left"
            in={Boolean(iterationGutter)}
            container={containerRef.current}
            key={iterationGutter.iterationNumber}
        >
            <RoundedAccordion
                expanded={expanded === iterationGutter.iterationNumber}
                onChange={handleChange(iterationGutter.iterationNumber)}
                TransitionProps={{ unmountOnExit: true }}
                sx={{ backgroundColor: (theme) => theme.palette.grey[200] }}
                disableGutters
            >
                <AccordionHeader expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="button" sx={{ padding: '5px' }}>
                        {translate(
                            'Component.InfoPanel.Details.Loop.Iteration'
                        )}{' '}
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
                                    {Boolean(
                                        iterationGutter.iteratorElement
                                    ) && (
                                        <ReactJson
                                            src={{
                                                iterator: JSON.parse(
                                                    iterationGutter.iteratorElement
                                                ),
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
