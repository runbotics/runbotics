import React, { FC, useEffect, useState } from 'react';

import { LinearProgress, Typography } from '@mui/material';

import { Box } from '@mui/system';

import { UiSchema } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import { v4 as uuidv4 } from 'uuid';

import ErrorBoundary from '#src-app/components/utils/ErrorBoundary';
import useTranslations from '#src-app/hooks/useTranslations';
import { IAction } from '#src-app/types/model/action.model';
import JSONSchemaFormRenderer from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/renderers/JSONSchemaFormRenderer';
import customWidgets from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets';

interface Live {
    id: string;
    definition: {
        schema: JSONSchema7;
        uiSchema: UiSchema;
        formData: string;
    }
}

interface LiveViewProps {
    draft: IAction;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

export const LiveView: FC<LiveViewProps> = ({ draft, loading, setLoading }) => {
    const { translate } = useTranslations();

    const [live, setLive] = useState<Live | null>(null);

    useEffect(() => {
        setLoading(true);
        const handler = setTimeout(() => {
            setLive({
                id: uuidv4(),
                definition: JSON.parse(draft.form)
            });
            setLoading(false);
        }, 1000);
        return () => {
            clearTimeout(handler);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft.form]);

    return (
        <>
            <Box px={2} pt={1}>
                <Typography variant="h4" gutterBottom>
                    {translate('Action.Details.Dialog.LiveView')}
                </Typography>
            </Box>
            {loading && <LinearProgress />}
            {live && live.id && (
                <ErrorBoundary key={live.id}>
                    <JSONSchemaFormRenderer
                        id={live.id}
                        schema={live.definition.schema}
                        uiSchema={live.definition.uiSchema}
                        formData={live.definition.formData}
                        widgets={customWidgets}
                    />
                </ErrorBoundary>
            )}
        </>
    );
};
