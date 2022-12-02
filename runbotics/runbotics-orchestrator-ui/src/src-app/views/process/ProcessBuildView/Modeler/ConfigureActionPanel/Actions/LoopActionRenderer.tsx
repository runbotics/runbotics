import React, { FC } from 'react';

import { Box, Grid, Typography } from '@mui/material';


import { useBpmnFormContext } from '#src-app/providers/BpmnForm.provider';

import { useDispatch } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import { BPMNHelper, BpmnSubProcess } from '../../BPMN';
import JSONSchemaFormRenderer from '../JSONSchemaFormRenderer';
import customWidgets from '../widgets';
import { IFormData } from './types';


const LoopActionRenderer: FC = () => {
    const dispatch = useDispatch();
    const { element, action, modeler } = useBpmnFormContext();

    const isLoopElement = (ele: unknown): ele is BpmnSubProcess =>
        (ele as BpmnSubProcess)?.businessObject?.loopCharacteristics !== undefined;

    const CUSTOM_FORMATS = { variableName: /(^\$.+)|(^#.+)/ };

    const defaultFormData = React.useMemo(() => {
        if (!isLoopElement(element)) return null;

        const defaultParameters = {
            input: {
                iterations: '',
                loopType: 'Repeat',
                elementVariable: '',
                collection: '',
            },
            output: {},
        };

        if (parseInt(element.businessObject.loopCharacteristics?.loopCardinality?.body)) {
            defaultParameters.input.iterations = element.businessObject.loopCharacteristics.loopCardinality.body;
            defaultParameters.input.loopType = 'Repeat';
        } else {
            for (const [key] of Object.entries(action.form.formData.input))
            { defaultParameters.input[key] = element.businessObject.loopCharacteristics[key]; }

            defaultParameters.input.loopType = 'Collection';
        }

        return defaultParameters;
    }, [action, element]);

    const formatLoopBody = (collectionName: string) => {
        if (collectionName.startsWith('#')) return `#{length(${collectionName.slice(2, -1)})}`;
        return `${collectionName.slice(0, -1)}.length}`;
    };

    // eslint-disable-next-line complexity
    const handleSubmit = (formState: IFormData) => {
        if (!isLoopElement(element)) return;

        const bpmnHelper = BPMNHelper.from(modeler);
        const { loopType } = formState.formData.input;
        const { loopCharacteristics } = element.businessObject;
        const { loopCardinality, collection } = loopCharacteristics;

        for (const [key, value] of Object.entries(formState.formData.input)) loopCharacteristics[key] = value;

        if (loopType === 'Repeat') loopCardinality.body = formState.formData.input.iterations;

        if (loopType === 'Collection' && collection) loopCardinality.body = formatLoopBody(collection);

        bpmnHelper.updateBusinessObject(element);
        dispatch(processActions.addAppliedAction(element.id));
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <Typography variant="h4" gutterBottom>
                        {action.label}
                    </Typography>
                </Box>
            </Grid>
            <JSONSchemaFormRenderer
                id={element.id}
                schema={action.form.schema}
                uiSchema={action.form.uiSchema}
                formData={defaultFormData}
                onSubmit={handleSubmit}
                widgets={customWidgets}
                customFormats={CUSTOM_FORMATS}
            />
        </>
    );
};

export default LoopActionRenderer;
