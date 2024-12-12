import { VFC, useState, useContext, FC } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    MenuItem,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { OrderDirection, OrderPropertyName, ProcessDto } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import { ProcessPageContext } from '#src-app/providers/ProcessPage.provider';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import { ProcessesTabs } from './ProcessBrowseView/Header';
import { getLastParamOfUrl } from '../utils/routerUtils';

type DeleteProcessDialogProps = {
    open?: boolean;
    process: ProcessDto;
    onClose: () => void;
    onDelete: (process: ProcessDto) => void;
};

const DeleteProcessDialog: VFC<DeleteProcessDialogProps> = (props) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { page, pageSize, search } = useContext(ProcessPageContext);
    const { translate } = useTranslations();
    const searchParams = useSearchParams();
    const collectionId = searchParams.get('collectionId');
    const router = useRouter();
    const isCollectionsTab = getLastParamOfUrl(router) === ProcessesTabs.COLLECTIONS;

    const handleSubmit = async () => {
        await dispatch(processActions.deleteProcess({ resourceId: props.process.id }));
        props.onDelete(props.process);

        if (isCollectionsTab) {
            await dispatch(
                processActions.getProcessesPage({
                    pageParams: {
                        page,
                        size: pageSize,
                        sort: {
                            by: OrderPropertyName.UPDATED,
                            order: OrderDirection.DESC,
                        },
                        filter: {
                            contains: {
                                ...(search.trim() && {
                                    name: search.trim(),
                                    createdByName: search.trim(),
                                    tagName: search.trim(),
                                }),
                            },
                            equals: {
                                processCollectionId: collectionId !== null ? collectionId : 'null',
                            },
                        },
                    },
                }),
            );
        } else {
            dispatch(processActions.getProcessesAllPage({
                pageParams: {
                    page,
                    size: pageSize,
                    sort: {
                        by: OrderPropertyName.UPDATED,
                        order: OrderDirection.DESC,
                    },
                    filter: {
                        contains: {
                            ...(search.trim() && {
                                name: search.trim(),
                                createdByName: search.trim(),
                                tagName: search.trim(),
                            }),
                        },
                    },
                },
            }));
        }

        enqueueSnackbar(translate('Process.Delete.SuccessMessage', { name: props.process.name }), {
            variant: 'success',
        });
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                {translate('Process.Delete.Title', { name: props.process.name })}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {translate('Process.Delete.ConfirmationQuestion', { name: props.process.name })}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        props.onClose();
                    }}
                >
                    {translate('Common.Cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={handleSubmit}
                >
                    {translate('Common.Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

type DeleteProcessProps = {
    process: ProcessDto;
    handleMenuClose(): void;
};

const DeleteProcess: FC<DeleteProcessProps> = ({ process, handleMenuClose }) => {
    const [show, setShow] = useState(false);
    const { translate } = useTranslations();

    const handleDelete = () => {
        setShow(false);
    };

    return (
        <>
            <MenuItem onClick={() => {
                setShow(true);
                handleMenuClose();
            }}>
                {translate('Process.Delete.ActionName')}
            </MenuItem>
            <DeleteProcessDialog
                process={process}
                open={show}
                onClose={() => setShow(false)}
                onDelete={handleDelete}
            />
        </>
    );
};

export default DeleteProcess;
