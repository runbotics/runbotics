import React, { FC, FunctionComponent, useEffect } from 'react';
import { Grid } from '@mui/material';
import _ from 'lodash';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { useSelector } from 'src/store';
import { useBpmnFormContext } from 'src/providers/BpmnForm.provider';
import ActionFormRenderer from './ActionFormRenderer';
import ConnectionFormRenderer from './ConnectionFormRenderer';
import internalBpmnActions from './Actions';
import LoopActionRenderer from './Actions/LoopActionRenderer';

const ConfigureActionPanel: FC = () => {
    const { element, setAction, action } = useBpmnFormContext();

    const CustomActionRenderer = new Map<string, FunctionComponent<any>>([['loop.loop', LoopActionRenderer]]);
    const externalBpmnActions = useSelector((state) => state.action.bpmnActions.byId);

    const actionId = element ? element.businessObject.actionId : undefined;

    useEffect(() => {
        if (actionId) {
            const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
            setAction(externalAction || internalBpmnActions[element?.businessObject.actionId]);
        } else {
            setAction(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionId, externalBpmnActions, element?.businessObject.actionId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const CustomRenderer = React.useMemo(() => CustomActionRenderer.get(action?.id), [action?.id]);

    return (
        <Grid container sx={{ pl: 1 }}>
            {action && CustomRenderer && <CustomRenderer />}
            {action && !CustomRenderer && <ActionFormRenderer />}
            {!action && is(element, 'bpmn:SequenceFlow') && <ConnectionFormRenderer />}
        </Grid>
    );
};

export default ConfigureActionPanel;
