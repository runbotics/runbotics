import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import _ from 'lodash';
import Cron from 'src/components/cron';
import {
    Box, Button, DialogActions, Paper, Tooltip,
} from '@mui/material';
import useTranslations from 'src/hooks/useTranslations';
import If from '../../../components/utils/If';
import { useSelector } from '../../../store';

const SubmitButton = styled(Button)(({ theme }) => `
    && {
        padding-left: ${theme.spacing(8)};
        padding-right: ${theme.spacing(8)};
        color: ${theme.palette.common.white};
    }
`);

const StyledBox = styled(Box)(({ theme }) => `
    & > div {
        display: flex;
        align-items: center;
    }

    && .react-js-cron-field {
        margin-bottom: ${theme.spacing(0)};
    }
`);

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
        return (
            <Cron
                value={cron5Digit}
                setValue={(cron) => props.onChange(`${splitted[0]} ${cron}`)}
                clearButton={false}
            />
        );
    };

    useEffect(() => {
        if (isSubmitSuccessful) reset();
    }, [isSubmitSuccessful]);

    const { process, loading } = useSelector((state) => state.process.draft);
    const isSubmitButtonDisabled = isSubmitting || !process.system || !process.botCollection;
    const submitButton = (
        <SubmitButton
            disabled={isSubmitButtonDisabled}
            type="submit"
            variant="contained"
            color="primary"
        >
            {translate('Common.Schedule')}
        </SubmitButton>
    );

    return (
        <Box>
            <Paper elevation={1}>
                <form onSubmit={handleSubmit(onProcessScheduler)}>
                    <DialogActions>
                        <StyledBox display="flex" gap="0.5rem" alignContent="center">
                            <Controller
                                name="cron"
                                control={control}
                                render={renderCronComponent}
                            />
                            <If condition={isSubmitButtonDisabled} else={submitButton}>
                                <Tooltip
                                    title={translate('Process.Schedule.Tooltip.PickBotAndCollection')}
                                    placement="top"
                                >
                                    <span>
                                        {submitButton}
                                    </span>
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
