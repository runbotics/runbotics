import React, {
    FC,
    ReactNode,
    FormEvent,
    useEffect,
    useState,
    useRef,
    useLayoutEffect
} from 'react';

import { Box, Button, Grid, Alert } from '@mui/material';
import { ErrorListProps, FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { Theme5 as Mui5Theme } from '@rjsf/material-ui';
import _ from 'lodash';

import useDebounce from '#src-app/hooks/useDebounce';
import { translate } from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import { ModelerError, processActions } from '#src-app/store/slices/Process';

import i18n from '#src-app/translations/i18n';

import { FormState } from '../../../../../../Actions/types';
import AutocompleteWidget from '../widgets/AutocompleteWidget';
import FieldTemplate from '../widgets/FieldTemplate';


const Form = withTheme<any>(Mui5Theme) as FC<FormProps<any>>;

const widgets = {
    Autocomplete: AutocompleteWidget,
};

interface FormPropsExtended extends FormProps<any> {
    panel?: ReactNode;
    onSubmit?: (
        e: any,
        nativeEvent?: FormEvent<HTMLFormElement>,
        error?: ModelerError
    ) => void;
    name?: string;
}

function ErrorListTemplate(props: ErrorListProps) {
    const { errors } = props;
    const alertMessage = translate(
        'Process.Details.Modeler.ActionPanel.Form.JSONSchema.Errors.ErrorsList',
        { errors: errors.length }
    );

    return <Alert severity="error">{alertMessage}</Alert>;
}

const DEBOUNCE_TIME = 400;
const initialFormState = {
    id: null,
    formData: null,
};

const JSONSchemaFormRenderer: FC<FormPropsExtended> = (props) => {

    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const isFormDirty = !_.isEqual(formState.formData, props.formData);
    // Reference to the form state used in component cleanup
    const formValueRef = useRef<FormState>(initialFormState);
    const isFormDirtyRef = useRef(isFormDirty);
    const editModeRef = useRef(editMode);
    const debouncedForm = useDebounce<FormState>(formState, DEBOUNCE_TIME);
    const { selectedElement } = useSelector(state => state.process.modeler);

    const [formRef, setFormRef] = useState<HTMLElement | undefined>(undefined);
    const [addButton, setAddButton] = useState<HTMLElement | undefined>(undefined);

    const handleSubmit = (e: any, nativeEvent?: FormEvent<HTMLFormElement>) => {
        setEditMode(false);
        return props.onSubmit ? props.onSubmit(e, nativeEvent) : null;
    };

    const handleChange = (e: IChangeEvent<FormData>) => {
        setEditMode(true);
        setFormState(prevState => ({
            ...prevState,
            formData: { ...e.formData, validationError: e.errors?.length > 0 },
        }));
        if (!editMode) {
            dispatch(processActions.removeAppliedAction(props.id));
        }
    };

    useEffect(() => {
        // Update the form state refs used in component cleanup
        formValueRef.current = formState;
        isFormDirtyRef.current = isFormDirty;
        editModeRef.current = editMode;
    }, [formState, editMode, isFormDirty]);

    useEffect(() => {
        setFormState(prevState => ({
            ...prevState,
            id: props.id,
            formData: props.formData,
        }));
    }, [props.formData, props.id]);

    useEffect(() => {
        if (formState?.formData && isFormDirty) {
            handleSubmit(formState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedForm]);
    
    useEffect(
        () => () => {
            if (isFormDirtyRef.current && editModeRef.current) {
                handleSubmit(formValueRef.current);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useLayoutEffect(() => {
        if (!formRef) return;

        const observer = new MutationObserver(() => {
            const button = formRef.querySelector(
                '*#mainActionGrid button:has(svg[data-testid="AddIcon"])'
            ) as HTMLElement;

            if (button) {
                setAddButton(button);
            }
        });

        observer.observe(formRef, { childList: true, subtree: true });

        // eslint-disable-next-line consistent-return
        return () => {
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formRef, i18n.language]);

    useLayoutEffect(() => {
        if (!addButton) return;
        addButton.childNodes[1].textContent = translate(
            'Process.Details.Modeler.Widgets.FieldTemplate.Action.AddItem'
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addButton, i18n.language]);

    return (
        <Grid item xs={12} ref={setFormRef} id='mainActionGrid'>
            <Box px={1}>
                <Box display="flex">{props.panel}</Box>
                <Box p={1}>
                    {formState.id === props.id && (
                        <Form
                            {...props}
                            onSubmit={handleSubmit}
                            ErrorList={ErrorListTemplate}
                            noHtml5Validate
                            liveValidate
                            widgets={{ ...widgets, ...props.widgets }}
                            formData={formState.formData}
                            onChange={handleChange}
                            FieldTemplate={FieldTemplate}
                            formContext={{ selectedElement }}
                        >
                            <Button type="submit" style={{ display: 'none' }} />
                        </Form>
                    )}
                </Box>
            </Box>
        </Grid>
    );
};

export default JSONSchemaFormRenderer;
