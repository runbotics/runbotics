import React, { ChangeEvent } from 'react';

import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useOptions from '#src-app/hooks/useOptions';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import AutocompleteWidget
    from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/AutocompleteWidget';

import { FlowExpression, GatewayFormMenu, GatewayTitle } from './GatewayFormRenderer.styles';

import { BpmnConnectionFactory, IBpmnConnection, IBpmnGateway } from '../../helpers/elementParameters';

import FlowLabelForm from '../FlowLabelForm';

// eslint-disable-next-line max-lines-per-function
const GatewayFormRenderer = () => {
    const theme = useTheme();
    const { options } = useOptions();
    const { selectedElement } = useSelector(state => state.process.modeler);
    const { modeler } = useModelerContext();
    const gateway = selectedElement as IBpmnGateway;
    const { translate } = useTranslations();

    const [defaultFlow, setDefaultFlow] = React.useState(gateway.businessObject.default?.id);

    const createInitExpressions = () =>
        gateway.outgoing.reduce((initExpressions, flow) => {
            const expression = flow.businessObject.conditionExpression?.body;
            if (expression !== undefined) {
                initExpressions[flow.id] = expression;
            }
            return initExpressions;
        }, {});

    const [expressions, setExpressions] = React.useState(createInitExpressions());

    const setDefaultConnection = (outgoing: IBpmnConnection) => {
        setDefaultFlow(outgoing.id);
        BpmnConnectionFactory.from(modeler).setDefaultConnection(outgoing, gateway);
    };

    const handleFlowChanged = (value: string, id: string) => {
        gateway.outgoing.forEach((outgoing) => {
            if (expressions && id === outgoing.id && expressions[outgoing.id] !== value) {
                BpmnConnectionFactory.from(modeler).setConditionExpression(
                    outgoing,
                    value
                );
                setExpressions({ ...expressions, [id]: value });
            }
        });
    };

    const getOutgoingById = (id: string) =>
        gateway.outgoing.find((outgoing) => outgoing.id === id);

    const handleOnFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const outgoing = getOutgoingById(event.target.name);
        if (outgoing) {
            BpmnConnectionFactory.from(modeler).setConnectionColor(outgoing, theme.palette.primary.main);
        }
    };

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const outgoing = getOutgoingById(event.target.name);
        if (outgoing) {
            BpmnConnectionFactory.from(modeler).setConnectionColor(outgoing, theme.palette.common.black);
        }
    };

    const handleExpressionChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleFlowChanged(event.target.value, event.target.name);
    };

    const handleDefaultFlowChange = (event: ChangeEvent<HTMLInputElement>) => {
        gateway.outgoing.forEach((outgoing) => {
            if (event.target.value === outgoing.id && expressions) {
                setDefaultConnection(outgoing);
                BpmnConnectionFactory.from(modeler).setConditionExpression(
                    outgoing,
                    expressions[outgoing.id]
                );
            }
        });
    };

    const handleConnectionNameChange = (inputValue: string, flow: IBpmnConnection) => {
        BpmnConnectionFactory.from(modeler).setConnectionName(flow, inputValue);
        BpmnConnectionFactory.from(modeler).setConnectionColor(flow, theme.palette.common.black);
    };

    const handleNameChange = (inputValue: string) => {
        BpmnConnectionFactory.from(modeler).setGatewayName(gateway, inputValue);
    };

    const handleCancel = (flow: IBpmnConnection) => {
        BpmnConnectionFactory.from(modeler).setConnectionColor(flow, theme.palette.common.black);
    };

    return (
        <>
            <Grid item xs={12}>
                <GatewayTitle>
                    <Typography variant="h4" gutterBottom>
                        <FlowLabelForm
                            formLabel={translate('Process.Details.Modeler.ActionPanel.Form.GatewayName.Title')}
                            onSubmit={handleNameChange}
                            selectedElement={gateway}
                        />
                    </Typography>
                </GatewayTitle>
            </Grid>
            <GatewayFormMenu>
                <FormControl fullWidth>
                    <InputLabel id="default-flow-select-input-label">
                        {translate('Process.Details.Modeler.ActionPanel.Form.Gateway.DefaultFlow')}
                    </InputLabel>
                    <Select
                        labelId="default-flow-select-input-label"
                        label={translate('Process.Details.Modeler.ActionPanel.Form.Gateway.DefaultFlow')}
                        id="default-flow-select"
                        value={defaultFlow}
                        onChange={handleDefaultFlowChange}
                        onFocus={handleOnFocus}
                        onBlur={handleOnBlur}
                    >
                        {
                            gateway.outgoing.map((outgoing) => (
                                <MenuItem key={'flow-menu-item-' + outgoing.id} value={outgoing.id}>
                                    {outgoing.businessObject.name ? outgoing.businessObject.name : outgoing.id}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {
                    gateway.outgoing.map((outgoing) => (
                        <FlowExpression key={'flow-expression-' + outgoing.id}>
                            <FlowLabelForm
                                formLabel={translate('Process.Details.Modeler.ActionPanel.Form.FlowName.Title')}
                                onSubmit={(name) => handleConnectionNameChange(name, outgoing)}
                                selectedElement={outgoing}
                                onCancel={() => handleCancel(outgoing)}
                                onFocus={handleOnFocus}
                            />
                            <AutocompleteWidget
                                id={'autocomplete-text-field-' + outgoing.id}
                                handleEvent={true}
                                onChange={handleExpressionChange}
                                autocompleteOptions={options}
                                handleOnBlur={handleOnBlur}
                                handleOnFocus={handleOnFocus}
                                label={`${translate(
                                    'Process.Details.Modeler.ActionPanel.Form.Connection.Expression.Expression'
                                )}`}
                                value={outgoing.businessObject.conditionExpression?.body}
                                name={outgoing.id}
                                disabled={false}
                                required={false}
                                autofocus={false}
                                readonly={false}
                                multiple={false}
                                // WidgetProps required to be passed to the AutocompleteWidget
                                schema={{}}
                                uiSchema={{}}
                                rawErrors={null}
                                placeholder={''}
                                options={{}}
                                formContext={{}}
                                registry={null}
                                onBlur={null}
                                onFocus={null}
                            />
                        </FlowExpression>
                    ))
                }
            </GatewayFormMenu>
        </>
    );
};

export default GatewayFormRenderer;
