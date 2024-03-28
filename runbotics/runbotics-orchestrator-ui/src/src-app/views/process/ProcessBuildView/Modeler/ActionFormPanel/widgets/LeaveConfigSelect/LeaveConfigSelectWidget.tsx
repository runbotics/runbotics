import { FC } from 'react';

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { WidgetProps } from '@rjsf/core';

import useTranslations from '#src-app/hooks/useTranslations';

import leaveConfigNames from './leaveConfigs';

const LeaveConfigSelectWidget: FC<WidgetProps> = (props) => {
    const { translate } = useTranslations();

    const handleValueChange = (e: SelectChangeEvent<string>) => {
        props.onChange(e.target.value);
    };

    return (
        <FormControl>
            <InputLabel>
                {translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.LeaveConfig')}
            </InputLabel>
            <Select
                label={translate('Process.Details.Modeler.Actions.BeeOffice.CreateHolidayLeave.LeaveConfig')}
                value={props.value}
                onChange={handleValueChange}
            >
                {leaveConfigNames.map(name => (
                    <MenuItem value={name} key={name}>{name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LeaveConfigSelectWidget;
