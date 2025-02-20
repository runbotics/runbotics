import React, { FC, FunctionComponent, useEffect } from 'react';

import { Grid } from '@mui/material';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import _ from 'lodash';

import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import ActionFormRenderer from './renderers/ActionFormRenderer';
import ConnectionFormRenderer from './renderers/ConnectionFormRenderer';
import GatewayFormRenderer from './renderers/GatewayFormRenderer/GatewayFormRenderer';
import LoopActionRenderer from './renderers/LoopActionRenderer';
import internalBpmnActions from '../../../../../Actions';

const ActionFormPanel: FC = () => {
    const { selectedElement, selectedAction } = useSelector(
        state => state.process.modeler
    );

    const dispatch = useDispatch();
    const CustomActionRenderer = new Map<string, FunctionComponent<any>>([
        ['loop.loop', LoopActionRenderer]
    ]);
    const externalBpmnActions = useSelector(
        state => state.action.bpmnActions.byId
    );
    const { pluginBpmnActions } = useSelector(state => state.plugin);

    const actionId = selectedElement
        ? selectedElement.businessObject.actionId
        : undefined;

    useEffect(() => {
        if (actionId) {
            const externalAction = _.cloneDeep(
                externalBpmnActions[selectedElement?.businessObject.actionId]
            );
            dispatch(
                processActions.setSelectedAction(
                    externalAction ||
                    internalBpmnActions[selectedElement?.businessObject.actionId] ||
                    pluginBpmnActions[selectedElement?.businessObject.actionId]
                )
            );
        } else {
            dispatch(processActions.setSelectedAction(null));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        actionId,
        externalBpmnActions,
        selectedElement?.businessObject.actionId
    ]);
    const CustomRenderer = React.useMemo(
        () => CustomActionRenderer.get(selectedAction?.id),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedAction?.id]
    );

    return (
        <Grid container sx={{ pl: 1 }}>
            {selectedAction && CustomRenderer && <CustomRenderer />}
            {selectedAction && !CustomRenderer && <ActionFormRenderer />}
            {!selectedAction && is(selectedElement, 'bpmn:SequenceFlow') && (
                <ConnectionFormRenderer />
            )}
            {!selectedAction && is(selectedElement, 'bpmn:ExclusiveGateway') && (
                <GatewayFormRenderer />
            )}
        </Grid>
    );
};

export default ActionFormPanel;
