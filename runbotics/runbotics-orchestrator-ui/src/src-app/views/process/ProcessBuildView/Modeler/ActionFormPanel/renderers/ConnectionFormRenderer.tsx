import React from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { ISubmitEvent } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';

import { IFormData } from '#src-app/Actions/types';
import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import FlowLabelForm from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/FlowLabelForm';

import JSONSchemaFormRenderer from './JSONSchemaFormRenderer';

import {
    BpmnConnectionFactory,
    IBpmnConnection
} from '../../helpers/elementParameters';

import customWidgets from '../widgets';

const ConnectionFormRenderer = () => {
    const { selectedElement } = useSelector(state => state.process.modeler);
    const { modeler } = useModelerContext();
    const connection: IBpmnConnection = selectedElement;
    const { translate } = useTranslations();

    const schema: JSONSchema7 = React.useMemo(
        () => ({
            type: 'object',
            oneOf: [
                {
                    title: translate(
                        'Process.Details.Modeler.ActionPanel.Form.Connection.Expression'
                    ),
                    properties: {
                        expression: {
                            title: translate(
                                'Process.Details.Modeler.ActionPanel.Form.Connection.Expression.Expression'
                            ),
                            type: 'string'
                        }
                    },
                    required: []
                }
            ]
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const uiSchema = React.useMemo(
        () => ({
            expression: {
                // 'ui:widget': 'EditorWidget'
            }
        }),
        []
    );

    const defaultFormData = React.useMemo(
        () => ({
            expression: connection.businessObject.conditionExpression?.body
        }),
        [connection]
    );

    const handleSubmit = (event: ISubmitEvent<IFormData>) => {
        const data: IFormData = {
            ...event.formData
        };
        BpmnConnectionFactory.from(modeler).setConditionExpression(
            connection,
            data.expression
        );
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <Typography variant="h4" gutterBottom>
                        <FlowLabelForm
                            formLabel={translate('Process.Details.Modeler.ActionPanel.Form.FlowName.Title')}
                            onSubmit={
                                (name) => BpmnConnectionFactory.from(modeler).setConnectionName(connection, name)
                            }
                            selectedElement={connection}
                        />
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
