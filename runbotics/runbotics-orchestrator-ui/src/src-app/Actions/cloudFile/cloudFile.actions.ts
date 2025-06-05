import { CloudFileAction } from 'runbotics-common';

import { getCreateCloudFolderAction } from '#src-app/Actions/cloudFile/createCloudFolder.action';
import { getCreateShareLinkAction } from '#src-app/Actions/cloudFile/createShareLink.action';
import { getDeleteCloudItemAction } from '#src-app/Actions/cloudFile/deleteCloudItem.action';
import { getdDownloadCloudFileAction } from '#src-app/Actions/cloudFile/downloadCloudFile.action';
import { getSharepointListItemsAction } from '#src-app/Actions/cloudFile/getSharepointListItems.action';
import { getMoveCloudFileAction } from '#src-app/Actions/cloudFile/moveCloudFile.action';
import { getUploadCloudFileAction } from '#src-app/Actions/cloudFile/uploadCloudFile.action';

import { IBpmnAction } from '../types';

// eslint-disable-next-line max-lines-per-function
const getCloudFileActions: () => Record<string, IBpmnAction> = () => ({
    [CloudFileAction.DOWNLOAD_FILE]: getdDownloadCloudFileAction(),
    [CloudFileAction.UPLOAD_FILE]: getUploadCloudFileAction(),
    [CloudFileAction.CREATE_FOLDER]: getCreateCloudFolderAction(),
    [CloudFileAction.MOVE_FILE]: getMoveCloudFileAction(),
    [CloudFileAction.DELETE_ITEM]: getDeleteCloudItemAction(),
    [CloudFileAction.CREATE_SHARE_LINK]: getCreateShareLinkAction(),
    [CloudFileAction.GET_SHAREPOINT_LIST_ITEMS]: getSharepointListItemsAction(),
});

export default getCloudFileActions;
