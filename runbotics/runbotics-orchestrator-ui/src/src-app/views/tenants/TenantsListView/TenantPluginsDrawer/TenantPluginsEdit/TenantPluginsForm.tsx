import { Button, Stack } from '@mui/material';
import { UseFormHandleSubmit } from 'react-hook-form';
import { License } from 'runbotics-common';

import FormDatePicker from '#src-app/components/Form/FormDatePicker';
import FormInput from '#src-app/components/Form/FormInput';

import { PluginFormData } from './TenantPluginsEdit';



interface TenantPluginFormProps {
    control: any;
    handleSubmit: UseFormHandleSubmit<PluginFormData, undefined>;
    onSubmit: (data: License) => void;
    translate: (key: string) => string;
    isEdit?: boolean;
}

const TenantPluginForm: React.FC<TenantPluginFormProps> = ({control, handleSubmit, onSubmit, translate, isEdit}) => (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
            {!isEdit && (
                <FormInput
                    name="pluginName"
                    control={control}
                    label={translate('Tenant.Plugins.edit.pluginName')}
                    rules={{
                        required: translate('Tenant.Plugins.edit.required'),
                    }}
                />
            )}
            <FormDatePicker 
                name="expDate"
                control={control}
                label={translate('Tenant.Plugins.edit.expDate')}
                rules={{
                    required: translate('Tenant.Plugins.edit.required'),
                    validate: (value: Date | null) => !value || value >= new Date() || translate('Tenant.Plugins.edit.expDateFuture'),
                }}
            />
            <FormInput 
                name='license'
                control={control}
                label={translate('Tenant.Plugins.edit.license')}
                rules={{ required: translate('Tenant.Plugins.edit.required') }}
            />
            <FormInput 
                name='licenseKey'
                control={control}
                label={translate('Tenant.Plugins.edit.licenseKey')}
                rules={{ required: translate('Tenant.Plugins.edit.required') }}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
            >
                {translate('Tenant.Plugins.edit.Submit')}
            </Button>
        </Stack>
    </form>
);

export default TenantPluginForm;
