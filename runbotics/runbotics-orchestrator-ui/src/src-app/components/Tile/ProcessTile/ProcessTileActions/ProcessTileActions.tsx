import React, { useState, VFC, useContext } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey, IProcess, OrderDirection, OrderPropertyName, Role } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAuth from '#src-app/hooks/useAuth';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import { useOwner } from '#src-app/hooks/useOwner';
import useRole from '#src-app/hooks/useRole';
import useTranslations from '#src-app/hooks/useTranslations';
import { ProcessPageContext } from '#src-app/providers/ProcessPage.provider';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import DeleteProcess from '#src-app/views/process/DeleteProcess';
import EditProcessDialog from '#src-app/views/process/EditProcessDialog';

import { ProcessesTabs } from '#src-app/views/process/ProcessBrowseView/Header';
import { ProcessDetailsDialog } from '#src-app/views/process/ProcessDetailsDialog/ProcessDetailsDialog';
import { getLastParamOfUrl } from '#src-app/views/utils/routerUtils';

import { ProcessTileActionsProps } from './ProcessTileActions.types';

// eslint-disable-next-line max-lines-per-function
const ProcessTileActions: VFC<ProcessTileActionsProps> = ({ process }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { translate } = useTranslations();
    const { page, pageSize, search } = useContext(ProcessPageContext);
    const searchParams = useSearchParams();
    const collectionId = searchParams.get('collectionId');
    const router = useRouter();
    const isCollectionsTab =
        getLastParamOfUrl(router) === ProcessesTabs.COLLECTIONS;
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
    const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
    const [isDetailsDialogVisible, setIsDetailsDialogVisible] = useState(false);
    const hasEditProcessAccess = useFeatureKey([FeatureKey.PROCESS_EDIT_INFO]);
    const hasDeleteProcessAccess = useFeatureKey([FeatureKey.PROCESS_DELETE]);
    const isAdmin = useRole([Role.ROLE_ADMIN, Role.ROLE_TENANT_ADMIN]);
    const isProcessOwner = useOwner();
    const hasModifyProcessAccess =
        isAdmin || isProcessOwner(process.createdBy?.id);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenEditModal = () => {
        setIsDetailsDialogVisible(false);
        setIsEditDialogVisible(true);
        handleClose();
    };

    const handleOpenDetailsModal = () => {
        setIsDetailsDialogVisible(true);
        handleClose();
    };

    const handleEdit = async (processToSave: IProcess) => {
        try {
            await dispatch(processActions.updateProcess({ resourceId: processToSave.id, payload: processToSave }));
            setIsEditDialogVisible(false);
            const hasAllProcessesAccess = hasFeatureKeyAccess(user, [FeatureKey.ALL_PROCESSES_READ]);
            const action = hasAllProcessesAccess
                ? processActions.getProcessesAllPage
                : processActions.getProcessesPage;

            if (isCollectionsTab) {
                await dispatch(
                    action({
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
                                        'createdBy->email': search.trim(),
                                        'tags->name': search.trim(),
                                    })
                                },
                                equals: {
                                    processCollectionId: collectionId !== null ? collectionId : 'null',
                                },
                            }
                        }
                    }),
                );
            } else {
                await dispatch(
                    action({
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
                                        'createdBy->email': search.trim(),
                                        'tags->name': search.trim(),
                                    })
                                }
                            }
                        }
                    }),
                );
            }
            enqueueSnackbar(
                translate('Component.Tile.Process.Update.Success', {
                    name: process.name,
                }),
                { variant: 'success' }
            );
        } catch (e) {
            enqueueSnackbar(
                translate('Component.Tile.Process.Update.Failed', {
                    name: process.name,
                }),
                { variant: 'error' }
            );
        }
    };

    return (
        <>
            <If
                condition={
                    hasModifyProcessAccess &&
                    (hasEditProcessAccess || hasDeleteProcessAccess)
                }
            >
                <IconButton
                    aria-label={translate(
                        'Component.Tile.Process.Settings.AriaLabel'
                    )}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={!!anchorEl}
                    onClose={handleClose}
                >
                    <If condition={hasEditProcessAccess}>
                        <MenuItem onClick={handleOpenEditModal}>
                            {translate('Common.Edit')}
                        </MenuItem>
                    </If>
                    <If condition={hasDeleteProcessAccess}>
                        <DeleteProcess
                            process={process}
                            handleMenuClose={handleClose}
                        />
                    </If>
                    <MenuItem onClick={handleOpenDetailsModal}>
                        {translate('Common.Details')}
                    </MenuItem>
                </Menu>
            </If>
            <EditProcessDialog
                open={hasEditProcessAccess && isEditDialogVisible}
                onClose={() => setIsEditDialogVisible(false)}
                onAdd={handleEdit}
                process={process}
            />
            <ProcessDetailsDialog
                process={process}
                isOpen={isDetailsDialogVisible}
                onClose={() => setIsDetailsDialogVisible(false)}
            />
        </>
    );
};

export default ProcessTileActions;
