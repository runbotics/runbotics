import React, { FC, useMemo } from 'react';

import { Box, Container, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import styles from './PrivacyPolicyView.module.scss';

interface Subsection {
    [key: string]: string;
}

interface PolicyMessage {
    [key: string]: {
        paragraph: string;
        subsection?: Subsection;
    };
}

const PrivacyPolicyView: FC = () => {
    const { translate } = useTranslations();

    const policyMessageStructure: PolicyMessage = {
        '1': { paragraph: translate('Landing.Policy.Page.Paragraph.1') },
        '2': {
            paragraph: translate('Landing.Policy.Page.Paragraph.2'),
            subsection: {
                a: translate('Landing.Policy.Page.Paragraph.2.a'),
                b: translate('Landing.Policy.Page.Paragraph.2.b'),
                c: translate('Landing.Policy.Page.Paragraph.2.c'),
                d: translate('Landing.Policy.Page.Paragraph.2.d'),
                e: translate('Landing.Policy.Page.Paragraph.2.e'),
                f: translate('Landing.Policy.Page.Paragraph.2.f'),
            },
        },
        '3': { paragraph: translate('Landing.Policy.Page.Paragraph.3') },
        '4': {
            paragraph: translate('Landing.Policy.Page.Paragraph.4'),
            subsection: {
                a: translate('Landing.Policy.Page.Paragraph.4.a'),
                b: translate('Landing.Policy.Page.Paragraph.4.b'),
            },
        },
        '5': { paragraph: translate('Landing.Policy.Page.Paragraph.5') },
        '6': { paragraph: translate('Landing.Policy.Page.Paragraph.6') },
        '7': { paragraph: translate('Landing.Policy.Page.Paragraph.7') },
        '8': { paragraph: translate('Landing.Policy.Page.Paragraph.8') },
        '9': { paragraph: translate('Landing.Policy.Page.Paragraph.9') },
        '10': { paragraph: translate('Landing.Policy.Page.Paragraph.10') },
    };

    const renderSubsections = (subsection: Subsection) =>
        Object.keys(subsection).map((key) => (
            <Box key={key} marginLeft={3} display="flex" gap={1}>
                <Typography>{key}.</Typography>
                <Typography>{subsection[key]}</Typography>
            </Box>
        ));

    const renderParagraphs = useMemo( () => Object.keys(policyMessageStructure).map((key) => (
        <Box key={key} mb={1}>
            <Box display="flex" gap={1}>
                <Typography>{key}.</Typography>
                <Typography>{policyMessageStructure[key].paragraph}</Typography>
            </Box>
            {policyMessageStructure[key].subsection && renderSubsections(policyMessageStructure[key].subsection)}
        </Box>
        // eslint-disable-next-line react-hooks/exhaustive-deps
    )), [translate]);

    return (
        <Container className={styles.container} maxWidth="md">
            <Typography variant="h1" textAlign="center" marginY={10}>
                {translate('Landing.Policy.Page.Title')}
            </Typography>
            <Typography mb={2}>
                {translate('Landing.Policy.Page.Greeting')}
            </Typography>
            <Typography mb={1}>
                {translate('Landing.Policy.Page.Introduction')}
            </Typography>
            {renderParagraphs}
        </Container>
    );
};

export default PrivacyPolicyView;
