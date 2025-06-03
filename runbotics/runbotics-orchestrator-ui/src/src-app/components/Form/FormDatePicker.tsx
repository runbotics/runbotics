import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';


interface FormDatePickerProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    rules?: any;
    fullWidth?: boolean;
}

const FormDatePicker = <T extends FieldValues>({ name, control, label, rules, fullWidth = true }: FormDatePickerProps<T>) => (
    <Controller 
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
            <DatePicker 
                label={label}
                value={field.value}
                onChange={field.onChange}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        error={!!fieldState.error} 
                        helperText={fieldState.error?.message} 
                        fullWidth={fullWidth} 
                    />
                )}
            />
        )}
    />
);

export default FormDatePicker;
