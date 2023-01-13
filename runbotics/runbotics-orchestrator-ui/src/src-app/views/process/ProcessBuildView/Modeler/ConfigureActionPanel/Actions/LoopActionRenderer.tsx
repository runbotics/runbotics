import React, { FC } from 'react';

import { Box, Grid, Typography } from '@mui/material';

import { useDispatch, useSelector } from '#src-app/store';

import { processActions } from '#src-app/store/slices/Process';

import { BPMNHelper, BpmnSubProcess } from '../../BPMN';
import JSONSchemaFormRenderer from '../JSONSchemaFormRenderer';
import customWidgets from '../widgets';
import { IFormData } from './types';
import { useModelerContext } from '#src-app/providers/ModelerProvider';

const LoopActionRenderer: FC = () => {
    const dispatch = useDispatch();
    const { modelerRef } = useModelerContext();
    const { selectedElement, selectedAction } = useSelector(
        (state) => state.process.modeler
    );

    const isLoopElement = (ele: unknown): ele is BpmnSubProcess =>
        (ele as BpmnSubProcess)?.businessObject?.loopCharacteristics !==
        undefined;

    const CUSTOM_FORMATS = { variableName: /(^\$.+)|(^#.+)/ };

    const defaultFormData = React.useMemo(() => {
        if (!isLoopElement(selectedElement)) return null;

        const defaultParameters = {
            input: {
                iterations: '',
                loopType: 'Repeat',
                elementVariable: '',
                collection: '',
            },
            output: {},
        };

        if (
            parseInt(
                selectedElement.businessObject.loopCharacteristics
                    ?.loopCardinality?.body
            )
        ) {
            defaultParameters.input.iterations =
                selectedElement.businessObject.loopCharacteristics.loopCardinality.body;
            defaultParameters.input.loopType = 'Repeat';
        } else {
            for (const [key] of Object.entries(
                selectedAction.form.formData.input
            )) {
                defaultParameters.input[key] =
                    selectedElement.businessObject.loopCharacteristics[key];
            }

            defaultParameters.input.loopType = 'Collection';
        }

        return defaultParameters;
    }, [selectedAction, selectedElement]);

    const formatLoopBody = (collectionName: string) => {
        if (collectionName.startsWith('#'))
            return `#{length(${collectionName.slice(2, -1)})}`;
        return `${collectionName.slice(0, -1)}.length}`;
    };

    // eslint-disable-next-line complexity
    const handleSubmit = (formState: IFormData) => {
        if (!isLoopElement(selectedElement)) return;

        const bpmnHelper = BPMNHelper.from(modelerRef.current);
        const { loopType } = formState.formData.input;
        const { loopCharacteristics } = selectedElement.businessObject;
        const { loopCardinality, collection } = loopCharacteristics;

        for (const [key, value] of Object.entries(formState.formData.input))
            loopCharacteristics[key] = value;

        if (loopType === 'Repeat')
            loopCardinality.body = formState.formData.input.iterations;

        if (loopType === 'Collection' && collection)
            loopCardinality.body = formatLoopBody(collection);

        bpmnHelper.updateBusinessObject(selectedElement);
        dispatch(processActions.addAppliedAction(selectedElement.id));
    };

    return (
        <>
            <Grid item xs={12}>
                <Box px={2} pt={1}>
                    <Typography variant="h4" gutterBottom>
                        {selectedAction.label}
                    </Typography>
                </Box>
            </Grid>
            <JSONSchemaFormRenderer
                id={selectedElement.id}
                schema={selectedAction.form.schema}
                uiSchema={selectedAction.form.uiSchema}
                formData={defaultFormData}
                onSubmit={handleSubmit}
                widgets={customWidgets}
                customFormats={CUSTOM_FORMATS}
            />
        </>
    );
};

export default LoopActionRenderer;
