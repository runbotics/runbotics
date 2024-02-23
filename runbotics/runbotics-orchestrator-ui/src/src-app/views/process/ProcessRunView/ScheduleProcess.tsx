import React, { FC, useEffect, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, Paper, Tooltip } from '@mui/material';
import _ from 'lodash';
import { Controller, ControllerProps, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';

import AttendedProcessModal from '#src-app/components/AttendedProcessModal/AttendedProcessModal';
import Cron from '#src-app/components/cron';
import useTranslations from '#src-app/hooks/useTranslations';

import { currentProcessSelector } from '#src-app/store/slices/Process';

import { useCurrentLocale } from '../../../components/cron/useCurrentLocale';
import If from '../../../components/utils/If';
import { useSelector } from '../../../store';


const SubmitButton = styled(Button)(
    ({ theme }) => `
    && {
        margin-right: ${theme.spacing(1)};
        padding-left: ${theme.spacing(7)};
        padding-right: ${theme.spacing(7)};
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
    inputVariables: yup.string().notRequired(),
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
            inputVariables: '',
        },
    });
    const { translate } = useTranslations();
    const { isAttended } = useSelector(currentProcessSelector);
    const currentLocale = useCurrentLocale();

    const [modalOpen, setModalOpen] = useState(false);
    const [cron, setCron] = useState('0 * * * * *');
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const renderCronComponent = (props: Parameters<ControllerProps['render']>[number]) => {
        const splitted = _.split(props.field.value, ' ');
        const cron5Digit = _.join(splitted.slice(1), ' ');

        return (
            <Cron
                value={cron5Digit}
                setValue={(cronValue) => {
                    setCron(`${splitted[0]} ${cronValue}`);
                    props.field.onChange(`${splitted[0]} ${cronValue}`);
                }}
                locale={currentLocale}
            />
        );
    };

    const handleRunAttendedProcess = (variables: Record<string, any>) => {
        reset();
        closeModal();
        onProcessScheduler({
            cron,
            variables: JSON.stringify(variables),
        });
    };

    useEffect(() => {
        if (isSubmitSuccessful) reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const { process } = useSelector((state) => state.process.draft);
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

    const submitWithFormButton = (
        <div>
            <AttendedProcessModal
                open={modalOpen}
                process={process}
                setOpen={setModalOpen}
                onSubmit={handleRunAttendedProcess}
            />
            <SubmitButton color="primary" variant="contained" onClick={openModal} disabled={isSubmitButtonDisabled}>
                {translate('Common.Schedule')}
            </SubmitButton>
        </div>
    );

    return (
        <Box>
            <Paper elevation={1}>
                <StyledBox display="flex" alignContent="center">
                    <form onSubmit={handleSubmit(onProcessScheduler)}>
                        <DialogActions>
                            <StyledBox display="flex" gap="0.5rem" alignContent="center">
                                <Controller
                                    name="cron"
                                    control={control}
                                    render={renderCronComponent}
                                />
                                <If condition={!isAttended}>
                                    <div>{submitButton}</div>
                                </If>
                            </StyledBox>
                        </DialogActions>
                    </form>
                    <If condition={isAttended}>
                        {submitWithFormButton}
                    </If>
                </StyledBox>
            </Paper>
        </Box>
    );
};

export default ScheduleProcess;
