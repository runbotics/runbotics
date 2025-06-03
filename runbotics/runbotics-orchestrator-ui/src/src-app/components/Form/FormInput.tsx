import { TextField } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    rules?: any;
    fullWidth?: boolean;
}

const FormInput = <T extends FieldValues>({ name, control, label, rules, fullWidth = true }: FormInputProps<T>) => (
    <Controller 
        name={name}
        control={control}
        rules={rules}
        render={({field, fieldState}) => (
            <TextField 
                {...field}
                label={label}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth={fullWidth}
            />
        )} 
    />
);

export default FormInput;
