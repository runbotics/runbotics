import React, { FC, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Box, Button, DialogActions, Paper, Tooltip } from '@mui/material';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';

import Cron from '#src-app/components/cron';
import useTranslations from '#src-app/hooks/useTranslations';

import { useCurrentLocale } from '../../../components/cron/useCurrentLocale';
import If from '../../../components/utils/If';
import { useSelector } from '../../../store';


const SubmitButton = styled(Button)(
    ({ theme }) => `
    && {
        padding-left: ${theme.spacing(8)};
        padding-right: ${theme.spacing(8)};
        color: ${theme.palette.common.white};
    }
`,
);

const StyledBox = styled(Box)(
    ({ theme }) => `
    & > div {
        display: flex;
        align-items: center;
    }

    && .react-js-cron-field {
        margin-bottom: ${theme.spacing(0)};
    }
`,
);

const scheduleProcessSchema = yup.object().shape({
    cron: yup.string().required(),
});

interface ScheduleProcessProps {
    onProcessScheduler: (data: Record<string, string>) => void;
}

const ScheduleProcess: FC<ScheduleProcessProps> = ({ onProcessScheduler }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isSubmitSuccessful },
    } = useForm({
        resolver: yupResolver(scheduleProcessSchema),
        defaultValues: {
            cron: '0 * * * * *',
        },
    });
    const { translate } = useTranslations();

    const renderCronComponent = (props) => {
        const splitted = _.split(props.value, ' ');
        const cron5Digit = _.join(splitted.slice(1), ' ');

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const currentLocale = useCurrentLocale();

        return (
            <Cron
                value={cron5Digit}
                setValue={(cron) => props.onChange(`${splitted[0]} ${cron}`)}
                locale={currentLocale}
            />
        );
    };

    useEffect(() => {
        if (isSubmitSuccessful) reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const { process } = useSelector((state) => state.process.draft);
    const isSubmitButtonDisabled = isSubmitting || !process.system || !process.botCollection;
    const submitButton = (
        <SubmitButton disabled={isSubmitButtonDisabled} type="submit" variant="contained" color="primary">
            {translate('Common.Schedule')}
        </SubmitButton>
    );

    return (
        <Box>
            <Paper elevation={1}>
                <form onSubmit={handleSubmit(onProcessScheduler)}>
                    <DialogActions>
                        <StyledBox display="flex" gap="0.5rem" alignContent="center">
                            <Controller name="cron" control={control} render={renderCronComponent} />
                            <If condition={isSubmitButtonDisabled} else={submitButton}>
                                <Tooltip
                                    title={translate('Process.Schedule.Tooltip.PickBotAndCollection')}
                                    placement="top"
                                >
                                    <span>{submitButton}</span>
                                </Tooltip>
                            </If>
                        </StyledBox>
                    </DialogActions>
                </form>
            </Paper>
        </Box>
    );
};

export default ScheduleProcess;
