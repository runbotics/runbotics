import React, { FocusEvent, useEffect, useState } from 'react';

import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { BpmnElementType } from 'runbotics-common';

import { useModelerContext } from '#src-app/hooks/useModelerContext';
import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch, useSelector } from '#src-app/store';
import { ModelerErrorType, processActions } from '#src-app/store/slices/Process';

import { NewValueWithName } from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/AutocompleteWidget/AutocompleteWidget.types';

import DefaultGatewaySelect from './DefaultGatewaySelect';
import GatewayFlowExpression from './GatewayFlowExpression';
import { GatewayFormMenu, GatewayTitle } from './GatewayFormRenderer.styles';

import { getOutgoingById, isSequenceWithExpression } from './GatewayFormRenderer.utils';
import { BpmnConnectionFactory, IBpmnConnection, IBpmnGateway } from '../../../helpers/elementParameters';

import FlowLabelForm from '../../FlowLabelForm';

const EXCLUDED_CONNECTION_TYPES = [BpmnElementType.ASSOCIATION];

const GatewayFormRenderer = () => {
    const theme = useTheme();
    const { selectedElement } = useSelector(state => state.process.modeler);
    const { modeler } = useModelerContext();
    const gateway = selectedElement as IBpmnGateway;
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const [defaultFlow, setDefaultFlow] = useState(gateway.businessObject.default ? gateway.businessObject.default.id : 'None');
    const [expressions, setExpressions] = useState({});
    const [filteredGatewayConnections, setFilteredGatewayConnections] = useState<IBpmnConnection[]>([]);
    const noDefaultGateway = Boolean(gateway.businessObject.default);

    useEffect(() => {
        const tempFilteredGateway = gateway.outgoing.filter(connection => !EXCLUDED_CONNECTION_TYPES.includes(connection.type));

        const createInitExpressions = () =>
            tempFilteredGateway.reduce((initExpressions, flow) => {
                if (flow.businessObject.conditionExpression === undefined) {
                    BpmnConnectionFactory.from(modeler).setConditionExpression(flow, null);
                    dispatch(
                        processActions.setCustomValidationError({
                            elementId: flow.id,
                            elementName: `${flow.businessObject.name ?? flow.id}`,
                            type: ModelerErrorType.FORM_ERROR
                        })
                    );
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

    const validateFlows = () => {
        const flowsToCheck = noDefaultGateway
            ? filteredGatewayConnections
            : filteredGatewayConnections.filter(flow => flow.id !== defaultFlow);

        flowsToCheck.forEach(checkExpression);
    };

    const checkExpression = flow => {
        if (isSequenceWithExpression(gateway, flow)) {
            dispatch(processActions.removeCustomValidationError(flow.id));
        } else {
            dispatch(
                processActions.setCustomValidationError({
                    elementId: flow.id,
                    elementName: `${flow.businessObject.name ?? flow.id}`,
                    type: ModelerErrorType.FORM_ERROR
                })
            );
        }
    };

    const handleFlowChanged = (value: string, id: string) => {
        filteredGatewayConnections.forEach(outgoing => {
            if (expressions && id === outgoing.id && expressions[outgoing.id] !== value) {
                BpmnConnectionFactory.from(modeler).setConditionExpression(outgoing, value);
                setExpressions({ ...expressions, [id]: value });
            }
        });
        validateFlows();
    };

    const handleOnFocus = (event: FocusEvent<HTMLInputElement>) => {
        validateFlows();
        const outgoing = getOutgoingById(gateway, event.target.name);
        if (outgoing) {
            BpmnConnectionFactory.from(modeler).setConnectionColor(outgoing, theme.palette.primary.main);
        }
    };

    const handleOnBlur = (event: FocusEvent<HTMLInputElement>) => {
        const outgoing = getOutgoingById(gateway, event.target.name);
        if (outgoing) {
            BpmnConnectionFactory.from(modeler).setConnectionColor(outgoing, theme.palette.common.black);
        }
    };

    const handleExpressionChange = (newValueWithName: NewValueWithName) => {
        handleFlowChanged(newValueWithName.value, newValueWithName.name);
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
                <DefaultGatewaySelect
                    gateway={gateway}
                    defaultFlow={defaultFlow}
                    setDefaultFlow={setDefaultFlow}
                    handleOnFocus={handleOnFocus}
                    handleOnBlur={handleOnBlur}
                    filteredGatewayConnections={filteredGatewayConnections}
                    modeler={modeler}
                    expressions={expressions}
                    validateFlows={validateFlows}
                />
                {filteredGatewayConnections.map(outgoing => (
                    <GatewayFlowExpression
                        key={outgoing.id}
                        gateway={gateway}
                        outgoing={outgoing}
                        handleOnFocus={handleOnFocus}
                        handleOnBlur={handleOnBlur}
                        handleCancel={handleCancel}
                        handleExpressionChange={handleExpressionChange}
                        handleConnectionNameChange={handleConnectionNameChange}
                    />
                ))}
            </GatewayFormMenu>
        </>
    );
};

export default GatewayFormRenderer;
