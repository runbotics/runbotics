import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import React, { FC, useState } from 'react';
import useTranslations from 'src/hooks/useTranslations';
import { ManageStartupModal } from 'src/components/StartupFormModal';
import If from 'src/components/utils/If';
import { useDispatch, useSelector } from 'src/store';
import { processActions } from 'src/store/slices/Process';
import styled from 'styled-components';
const PREFIX = 'AddProcessForm';

interface AddProcessFormProps {}

const classes = {
    root: `${PREFIX}-root`,
    btn: `${PREFIX}-btn`,
};

const StyledBox = styled(Box)(({ theme }) => ({
    [`& .${classes.root}`]: {},

    [`& .${classes.btn}`]: {
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        color: 'white',
    },
}));

const StyledButton = styled(LoadingButton)(
    ({ theme }) => `
    margin-top: ${theme.spacing(1)};
    & + & {
        margin-left: ${theme.spacing(1)};
    }
`,
);

const ManageProcessForm: FC<AddProcessFormProps> = ({}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { process } = useSelector((state) => state.process.draft);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleSubmit = (executionInfoSchema: string) => {
        closeModal();
        dispatch(processActions.partialUpdateProcess({ ...process, executionInfo: executionInfoSchema }));
    };

    const handleDelete = () => {
        dispatch(processActions.partialUpdateProcess({ ...process, executionInfo: '' }));
    };

    return (
        <>
            <If condition={modalOpen}>
                <ManageStartupModal
                    open={modalOpen}
                    setOpen={setModalOpen}
                    process={process}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                />
            </If>
            <StyledBox>
                <Paper elevation={1}>
                    <Box padding="0.5rem">
                        <StyledButton color="primary" className={classes.btn} variant="contained" onClick={openModal}>
                           {translate('Process.Run.ManageProcessForm')} 
                        </StyledButton>
                    </Box>
                </Paper>
            </StyledBox>
        </>
    );
};

export default ManageProcessForm;
