import { CloudFileAction } from 'runbotics-common';

import { getSharepointListItemsAction } from '#src-app/Actions/cloudFile/getSharepointListItemsAction';

import { IBpmnAction } from '../types';
import { downloadCloudFileAction } from '#src-app/Actions/cloudFile/downloadCloudFile.action';
import { uploadCloudFileAction } from '#src-app/Actions/cloudFile/uploadCloudFile.action';
import { createCloudFolderAction } from '#src-app/Actions/cloudFile/createCloudFolder.action';
import { moveCloudFileAction } from '#src-app/Actions/cloudFile/moveCloudFile.action';
import { deleteCloudItemAction } from '#src-app/Actions/cloudFile/deleteCloudItem.action';
import { createShareLinkAction } from '#src-app/Actions/cloudFile/createShareLink.action';

// eslint-disable-next-line max-lines-per-function
const getCloudFileActions: () => Record<string, IBpmnAction> = () => ({
    [CloudFileAction.GET_SHAREPOINT_LIST_ITEMS]: getSharepointListItemsAction,
    [CloudFileAction.DOWNLOAD_FILE]: downloadCloudFileAction,
    [CloudFileAction.UPLOAD_FILE]: uploadCloudFileAction,
    [CloudFileAction.CREATE_FOLDER]: createCloudFolderAction,
    [CloudFileAction.MOVE_FILE]: moveCloudFileAction,
    [CloudFileAction.DELETE_ITEM]: deleteCloudItemAction,
    [CloudFileAction.CREATE_SHARE_LINK]: createShareLinkAction,
});

export default getCloudFileActions;
