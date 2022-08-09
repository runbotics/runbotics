import TextField from '@mui/material/TextField';
import React, { useState, Fragment, FC } from 'react';

import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Select, { SelectProps } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {
    InputReturnTypes,
    InputTypes,
    UISchemaType,
    UseCheckboxReturnType,
    useObject,
    UseRadioReturnType,
    UseRawInputReturnType,
    UseSelectReturnType,
} from '../ReactHookFormJsonSchema/hooks';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DatePicker, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Chip, Box, IconButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete, { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
import Popper, { PopperProps } from '@mui/material/Popper';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { ById } from '../utils/dictionary';
import { ArrayJSONSchemaType, ErrorMessage, JSONSchemaType } from '../ReactHookFormJsonSchema';
import UploadFormField from './UploadFormField';

moment.updateLocale('en', {
    week: {
        dow: 1,
    },
});

export const getErrorMessage = (error: ErrorMessage) => {
    if (error) {
        switch (error.message) {
            case '__form_error_required__':
                return 'Pole jest wymagane';
        }

        return 'Wystąpił błąd ' + error.message;
    } else {
        return null;
    }
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 500,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

interface SpecializedObjectProps {
    baseObject: InputReturnTypes;
    onChange?: (...event: any[]) => void;
}

type AutocompleteInputRendererProps = {
    baseObject: UseRawInputReturnType<ArrayJSONSchemaType>;
};

const AutocompleteInputRenderer: FC<AutocompleteInputRendererProps> = ({ baseObject, ...rest }) => {
    const object = baseObject.getObject();
    const { name, id, control, type } = baseObject.getInputProps();
    const error = baseObject.getError();
    const { isRequired } = baseObject;

    return (
        <React.Fragment>
            <Controller
                name={name}
                defaultValue={baseObject.getCurrentValue()}
                render={(props: ControllerRenderProps) => {
                    let [options, setOptions] = useState<string[]>(object.items?.map((item) => item.title));
                    const [open, setOpen] = useState(false);
                    const onChange = (event: any, newValue: any) => {
                        props.onChange(newValue);
                    };
                    const handleInputChange = (event: any, newInputValue: string) => {
                        if (event && newInputValue && newInputValue.startsWith('${')) {
                            setOpen(true);
                        } else {
                            setOpen(false);
                        }
                    };

                    const handleOnClose = (event: object, reason: string) => {
                        setOpen(false);
                    };

                    console.log('props.vakue', props.value);

                    return (
                        <Autocomplete
                            fullWidth={true}
                            autoSelect={true}
                            autoComplete={true}
                            disableCloseOnSelect={false}
                            autoHighlight={true}
                            open={open}
                            onClose={handleOnClose}
                            freeSolo
                            value={props.value}
                            onChange={onChange}
                            onInputChange={handleInputChange}
                            options={options}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label={object.title}
                                    error={!!error}
                                    helperText={getErrorMessage(error)}
                                />
                            )}
                            PopperComponent={(props: any) => (
                                <Popper
                                    {...props}
                                    placement={'top'}
                                    modifiers={[{ name: 'flip', enabled: false }]}
                                    // container={PortalShadowRoot}
                                />
                            )}
                        />
                    );
                }}
                control={control}
                rules={{ required: isRequired }}
            />
        </React.Fragment>
    );
};

export function SpecializedObject(props: SpecializedObjectProps) {
    const classes = useStyles();
    const { isRequired } = props.baseObject;
    const baseObject = props.baseObject;
    const mainProps = props;
    const error = props.baseObject.getError();
    switch (props.baseObject.type) {
        case InputTypes.input: {
            let baseObject = props.baseObject as UseRawInputReturnType;
            // const format = "";
            const format = props.baseObject.getObject().format;
            const { name, id, control, type } = baseObject.getInputProps();
            const title = props.baseObject.getObject().title;
            if (format === 'date-time') {
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            name={name}
                            render={(props: ControllerRenderProps) => {
                                return (
                                    <DatePicker
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                label={title}
                                                error={!!error}
                                                required={isRequired}
                                                helperText={getErrorMessage(error)}
                                                fullWidth
                                                variant={'outlined'}
                                            />
                                        )}
                                        value={props.value !== undefined ? props.value : null}
                                        onChange={props.onChange}
                                        // autoOk
                                        inputFormat="YYYY/MM/DD"
                                        // inputVariant={'outlined'}
                                        // PopoverProps={{container: PortalShadowRoot}}
                                    />
                                );
                            }}
                            control={control}
                            rules={props.baseObject.validator}
                        />
                    </LocalizationProvider>
                );
            } else if (format === 'time') {
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            name={name}
                            render={(props: ControllerRenderProps) => {
                                return (
                                    <TimePicker
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                label={title}
                                                error={!!error} /*props.value.isValid ? props.value.isValid():moment(props.value, 'hh:mm A', true).isValid()*/
                                                required={isRequired}
                                                helperText={getErrorMessage(error)}
                                                fullWidth
                                                variant={'outlined'}
                                            />
                                        )}
                                        mask="__:__ _M"
                                        inputFormat="hh:mm A"
                                        value={props.value !== undefined ? props.value : null}
                                        onChange={props.onChange}
                                        ampm={true}
                                        // PopoverProps={{container: PortalShadowRoot}}
                                    />
                                );
                            }}
                            control={control}
                            rules={props.baseObject.validator}
                        />
                    </LocalizationProvider>
                );
            } else if (format == 'autocomplete') {
                return (
                    <AutocompleteInputRenderer
                        baseObject={props.baseObject as UseRawInputReturnType<ArrayJSONSchemaType>}
                    />
                );
            } else {
                return (
                    <Controller
                        name={name}
                        render={(props: ControllerRenderProps) => {
                            return (
                                <Box component="div">
                                    <TextField
                                        key={baseObject.getInputProps().key}
                                        error={!!error}
                                        helperText={getErrorMessage(error)}
                                        label={baseObject.getObject().title}
                                        fullWidth={true}
                                        size={baseObject.size}
                                        variant="outlined"
                                        value={props.value}
                                        placeholder={baseObject.getObject().placeholder}
                                        onChange={props.onChange}
                                        type={type}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        // inputProps={{...baseObject.getInputProps()}}
                                    ></TextField>
                                    {baseObject.copyToClipboard && (
                                        <CopyToClipboard text={props.value}>
                                            <IconButton>
                                                <FileCopyIcon />
                                            </IconButton>
                                        </CopyToClipboard>
                                    )}
                                </Box>
                            );
                        }}
                        control={control}
                        rules={props.baseObject.validator}
                    />
                );
            }
        }
        case InputTypes.radio: {
            let baseObject = props.baseObject as UseRadioReturnType;
            return (
                <React.Fragment>
                    <label {...baseObject.getLabelProps()}>{props.baseObject.getObject().title}</label>
                    {baseObject.getItems().map((value: any, index: any) => {
                        return (
                            <label {...baseObject.getItemLabelProps(index)} key={`${value}${index}`}>
                                {value}
                                <input {...baseObject.getItemInputProps(index)} />
                            </label>
                        );
                    })}
                </React.Fragment>
            );
        }
        case InputTypes.select: {
            let baseObject = props.baseObject as UseSelectReturnType;
            const { id, control, name } = baseObject.getSelectProps();
            const labelId = baseObject.getLabelProps().id;
            const title = baseObject.getObject().title;
            const items = baseObject.getItems();
            return (
                <React.Fragment>
                    <FormControl variant="outlined" fullWidth={true} error={!!error}>
                        <InputLabel id={labelId}>{props.baseObject.getObject().title}</InputLabel>
                        <Controller
                            name={name!}
                            render={(props: ControllerRenderProps) => {
                                const onChange = (event: any) => {
                                    props.onChange(event);
                                    mainProps.onChange ? mainProps.onChange(event) : {};
                                };
                                return (
                                    <Select
                                        labelId={labelId}
                                        label={title}
                                        // MenuProps={{
                                        //     container: PortalShadowRoot
                                        // }}
                                        value={props.value ? props.value : ''}
                                        onChange={onChange}
                                    >
                                        {items.map((value: any, index: any) => {
                                            const itemProps = baseObject.getItemOptionProps(index) as any;
                                            return (
                                                <MenuItem {...itemProps} key={`${value}${index}`}>
                                                    {itemProps.label}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                );
                            }}
                            control={control}
                            rules={{ required: isRequired }}
                        />
                        <FormHelperText>{getErrorMessage(error)}</FormHelperText>
                    </FormControl>
                </React.Fragment>
            );
        }

        case InputTypes.checkbox: {
            let baseObject = props.baseObject as UseCheckboxReturnType;

            const { control, name } = baseObject.getItemInputProps(0);

            const labelId = baseObject.getItemLabelProps(0).id;
            const title = props.baseObject.getObject().title;

            // @ts-ignore
            if (props.baseObject.isSingle) {
                return (
                    <React.Fragment>
                        <FormControlLabel
                            control={
                                <Controller
                                    name={name!}
                                    render={(props: ControllerRenderProps) => {
                                        const handleChange = (
                                            event: React.ChangeEvent<HTMLInputElement>,
                                            checked: boolean,
                                        ) => {
                                            props.onChange(checked);
                                        };
                                        return <Checkbox value={props.value} onChange={handleChange} />;
                                    }}
                                    control={control}
                                />
                            }
                            label={title}
                        />
                    </React.Fragment>
                );
            } else {
                let baseObject = props.baseObject as UseCheckboxReturnType;
                return (
                    <React.Fragment>
                        <Controller
                            name={props.baseObject.pointer}
                            render={(props: ControllerRenderProps) => {
                                let [options, setOptions] = useState(baseObject.getItems());
                                const onChange = (event: any, newValue: any) => {
                                    console.log('event', event);
                                    props.onChange(newValue);
                                    mainProps.onChange ? mainProps.onChange(event, newValue) : null;
                                };
                                const onInputChange = async (
                                    event: React.ChangeEvent<{}>,
                                    value: string,
                                    reason: AutocompleteInputChangeReason,
                                ) => {
                                    let apiResource = baseObject.getApiResource ? baseObject.getApiResource() : null;
                                    if (apiResource) {
                                        throw new Error('Api resource loader not loaded');
                                        // const result = await apiResourceLoader(apiResource, {value: value});
                                        // setOptions(baseObject.getItems().concat(result));
                                    }
                                };

                                return (
                                    <Autocomplete
                                        multiple={true}
                                        fullWidth={true}
                                        id={labelId}
                                        disableCloseOnSelect={true}
                                        clearOnBlur={false}
                                        value={props.value ? props.value : []}
                                        onChange={onChange}
                                        options={options}
                                        groupBy={(option) => option.type}
                                        getOptionLabel={(option: any) => option.label}
                                        isOptionEqualToValue={(option: any, entry: any) => {
                                            return option.value == entry.value;
                                        }}
                                        onInputChange={onInputChange}
                                        renderOption={(option: any, { selected }) => (
                                            <React.Fragment>
                                                <Checkbox
                                                    color="primary"
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.label}
                                            </React.Fragment>
                                        )}
                                        renderInput={(params) => (
                                            <TextField {...params} variant="outlined" label={title} />
                                        )}
                                        PopperComponent={(props: any) => (
                                            <Popper
                                                {...props}
                                                placement={'top'}
                                                modifiers={[{ name: 'flip', enabled: false }]}
                                                // container={PortalShadowRoot}
                                            />
                                        )}
                                    />
                                );
                            }}
                            control={baseObject.control}
                            rules={{ required: isRequired }}
                        />
                    </React.Fragment>
                );
            }
        }

        case InputTypes.upload:
            return <UploadFormField baseObject={props.baseObject} />;

        default:
            return <React.Fragment></React.Fragment>;
    }
}

export interface ObjectRendererProps {
    id: string;
    pointer: string;
    UISchema: UISchemaType;
    onChange?: ById<(...event: any[]) => void>;
}

export function ObjectRenderer(props: ObjectRendererProps) {
    const methods = useObject({
        pointer: props.pointer,
        UISchema: props.UISchema,
    });
    const onChange = props.onChange ? props.onChange : {};
    return (
        <React.Fragment>
            {methods.map((obj: InputReturnTypes) => (
                <Grid xs={obj.width} item key={`${props.id}${obj.type}${obj.pointer}`}>
                    <SpecializedObject baseObject={obj} onChange={onChange[obj.pointer]} />
                </Grid>
            ))}
        </React.Fragment>
    );
}

export function ObjectContainerRenderer(props: ObjectRendererProps) {
    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <ObjectRenderer {...props} />
            </Grid>
        </React.Fragment>
    );
}
