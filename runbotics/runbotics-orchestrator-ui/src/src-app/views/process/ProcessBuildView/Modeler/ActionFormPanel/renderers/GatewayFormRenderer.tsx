import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react';

import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { BpmnElementType } from 'runbotics-common';

import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useOptions from '#src-app/hooks/useOptions';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { ModelerErrorType, processActions } from '#src-app/store/slices/Process';

import AutocompleteWidget
    from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/AutocompleteWidget';
import {
    NewValueWithName
} from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/AutocompleteWidget/AutocompleteWidget.types';

import { FlowExpression, GatewayFormMenu, GatewayTitle } from './GatewayFormRenderer.styles';

import { BpmnConnectionFactory, IBpmnConnection, IBpmnGateway } from '../../helpers/elementParameters';

import FlowLabelForm from '../FlowLabelForm';

const EXCLUDED_CONNECTION_TYPES = [BpmnElementType.ASSOCIATION];

// eslint-disable-next-line max-lines-per-function
const GatewayFormRenderer = () => {
    const theme = useTheme();
    const { options } = useOptions();
    const { selectedElement } = useSelector(state => state.process.modeler);
    const { modeler } = useModelerContext();
    const gateway = selectedElement as IBpmnGateway;
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const [defaultFlow, setDefaultFlow] = useState(gateway.businessObject.default?.id);
    const [expressions, setExpressions] = useState({});
    const [filteredGatewayConnections, setFilteredGatewayConnections] = useState<IBpmnConnection[]>([]);

    useEffect(() => {
        const tempFilteredGateway = gateway.outgoing
            .filter(connection => !EXCLUDED_CONNECTION_TYPES.includes(connection.type));

        const createInitExpressions = () => tempFilteredGateway
            .reduce((initExpressions, flow) => {
                if (flow.businessObject.conditionExpression === undefined) {
                    BpmnConnectionFactory.from(modeler).setConditionExpression(flow, null);
                    dispatch(processActions.setCustomValidationError({
                        elementId: flow.id,
                        elementName: `${flow.businessObject.name ?? flow.id}`,
                        type: ModelerErrorType.FORM_ERROR,
                    }));
                }
                const expression = flow.businessObject.conditionExpression?.body;
                if (expression !== undefined) {
                    initExpressions[flow.id] = expression;
                }
                return initExpressions;
            }, {});

        setExpressions(createInitExpressions());
        setFilteredGatewayConnections(tempFilteredGateway);
    }, []);

    const isSequenceWithExpression = (outgoing: IBpmnConnection) =>
        gateway.businessObject.default?.id === outgoing.id || Boolean(outgoing.businessObject.conditionExpression?.body?.trim());

    const validateFlows = () => {
        filteredGatewayConnections
            .forEach((flow) => {
                if (isSequenceWithExpression(flow)) {
                    dispatch(processActions.removeCustomValidationError(flow.id));
                } else {
                    dispatch(processActions.setCustomValidationError({
                        elementId: flow.id,
                        elementName: `${flow.businessObject.name ?? flow.id}`,
                        type: ModelerErrorType.FORM_ERROR,
                    }));
                }
            });
    };

    const setDefaultConnection = (outgoing: IBpmnConnection) => {
        setDefaultFlow(outgoing.id);
        BpmnConnectionFactory.from(modeler).setDefaultConnection(outgoing, gateway);
        validateFlows();
    };

    const handleFlowChanged = (value: string, id: string) => {
        filteredGatewayConnections
            .forEach((outgoing) => {
                if (expressions && id === outgoing.id && expressions[outgoing.id] !== value) {
                    BpmnConnectionFactory.from(modeler).setConditionExpression(
                        outgoing,
                        value
                    );
                    setExpressions({ ...expressions, [id]: value });
                }
            });
        validateFlows();
    };

    const getOutgoingById = (id: string) =>
        gateway.outgoing.find((outgoing) => outgoing.id === id);

    const handleOnFocus = (event: FocusEvent<HTMLInputElement>) => {
        const outgoing = getOutgoingById(event.target.name);
        if (outgoing) {
            BpmnConnectionFactory.from(modeler).setConnectionColor(outgoing, theme.palette.primary.main);
        }
    };

    const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
        const outgoing = getOutgoingById(event.target.name);
        if (outgoing) {
            BpmnConnectionFactory.from(modeler).setConnectionColor(outgoing, theme.palette.common.black);
        }
    };

    const handleExpressionChange = (newValueWithName: NewValueWithName) => {
        handleFlowChanged(newValueWithName.value, newValueWithName.name);
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

    const emptyExpressionError = translate('Process.Edit.Form.Fields.Error.Required');

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
                            filteredGatewayConnections
                                .map((outgoing) => (
                                    <MenuItem key={'flow-menu-item-' + outgoing.id} value={outgoing.id}>
                                        {outgoing.businessObject.name ? outgoing.businessObject.name : outgoing.id}
                                    </MenuItem>
                                ))
                        }
                    </Select>
                </FormControl>
                {
                    filteredGatewayConnections
                        .map((outgoing) => (
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
                                    withName={true}
                                    onChange={handleExpressionChange}
                                    autocompleteOptions={options}
                                    handleOnBlur={handleOnBlur}
                                    handleOnFocus={handleOnFocus}
                                    label={`${translate(
                                        'Process.Details.Modeler.ActionPanel.Form.Connection.Expression.Expression'
                                    )}`}
                                    value={outgoing.businessObject.conditionExpression?.body ?? ''}
                                    name={outgoing.id}
                                    customErrors={isSequenceWithExpression(outgoing) ? undefined : [emptyExpressionError]}
                                    disabled={false}
                                    required={false}
                                    autofocus={false}
                                />
                            </FlowExpression>
                        ))
                }
            </GatewayFormMenu>
        </>
    );
};

export default GatewayFormRenderer;
