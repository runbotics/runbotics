import React, { FC, useState } from 'react';
import { ISubmitEvent } from '@rjsf/core';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { JSONSchema7 } from 'json-schema';
import { Box, Grid, Typography } from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';
import { IFormData } from './Actions/types';
import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';
import {
    BpmnConnectionFactory,
    IBpmnConnection,
} from '../BPMN';
import customWidgets from './widgets';
import { useBpmnFormContext } from 'src/providers/BpmnForm.provider';


const ConnectionFormRenderer = () => {
    const { element, modeler } = useBpmnFormContext();
    const connection: IBpmnConnection = element
    const [submitted, setSubmitted] = useState({});
    const { translate } = useTranslations();

    const schema: JSONSchema7 = React.useMemo(() => ({
        type: 'object',
        oneOf: [
            {
                title: translate('Process.Details.Modeler.ActionPanel.Form.Connection.Expression'),
                properties: {
                    expression: {
                        title: translate('Process.Details.Modeler.ActionPanel.Form.Connection.Expression.Expression'),
                        type: 'string',
                    },
                },
                required: [],
            },
        ],
    }),
        []);

    const uiSchema = React.useMemo(() => ({
        expression: {
            // 'ui:widget': 'EditorWidget'
        },
    }), []);

    const defaultFormData = React.useMemo(() => ({
        expression: connection.businessObject.conditionExpression?.body,
    }), [connection]);

    const handleSubmit = (event: ISubmitEvent<IFormData>) => {
        const data: IFormData = {
            ...event.formData,
        };
        BpmnConnectionFactory.from(modeler).setConditionExpression(connection, data.expression);

        setSubmitted(event.formData);
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <Typography variant="h4" gutterBottom>
                        {connection.id}
                    </Typography>
                </Box>
            </Grid>
            {defaultFormData && (
                <JSONSchemaFormRenderer
                    id={connection.id}
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={defaultFormData}
                    onSubmit={handleSubmit}
                    widgets={customWidgets}
                />
            )}
        </>
    );
};

export default ConnectionFormRenderer;
