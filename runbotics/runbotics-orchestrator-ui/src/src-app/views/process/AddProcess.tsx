/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, useState } from 'react';

import {
    SvgIcon,
    Button
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FilePlus } from 'react-feather';
import { IProcess } from 'runbotics-common';

import useProcessCollection from '#src-app/hooks/useProcessCollection';
import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';
import { ProcessTab } from '#src-app/utils/process-tab';

import EditProcessDialog from './EditProcessDialog';
import { getDefaultProcessInfo } from './EditProcessDialog/EditProcessDialog.utils';

export const AddProcess: FC = () => {
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();
    const { translate } = useTranslations();
    const { enqueueSnackbar } = useSnackbar();

    const handleAdd = (process: IProcess) => {
        router.push(`/app/processes/${process.id}/${ProcessTab.BUILD}`);
        enqueueSnackbar(`Redirecting to ${process.name}`, { variant: 'success' });
    };

    const currentUser = useSelector((state) => state.auth.user);
    const { currentCollection } = useProcessCollection();
    const defaultProcessInfo = getDefaultProcessInfo(currentUser, currentCollection);

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={
                    <SvgIcon fontSize="small">
                        <FilePlus />
                    </SvgIcon>
                }>
                {translate('Process.Add.ActionName')}
            </Button>
            <EditProcessDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                onAdd={handleAdd}
                process={defaultProcessInfo}
            />
        </>
    );
};

export default AddProcess;
