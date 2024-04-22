import React, { useEffect, FC } from 'react';

import { Typography, Box, LinearProgress } from '@mui/material';
import { CollectionId, ROOT_PROCESS_COLLECTION_ID } from 'runbotics-common';

import TreeStructure from '#src-app/components/TreeStructure';
import { TreeStructureItem } from '#src-app/components/TreeStructure/TreeStructure.types';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions } from '#src-app/store/slices/ProcessCollection';

import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { LocationOptionsProps, ProcessCollectionHierarchy } from './LocationOptions.types';
import { ABSTRACT_ROOT_COLLECTION_ID, accessTooltipIcon, getHierarchicalStructure } from './LocationOptions.utils';

const LocationOptions: FC<LocationOptionsProps> = ({ isModifyDialogOpen, handleChange, isOwner, collectionId }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { allUserAccessible: { isLoading, list: allUserAccessible } } = useSelector(state => state.processCollection);

    const rootCollections = allUserAccessible.filter(collection => collection.parentId === null);
    const userAccessibleHierarchy = rootCollections.map((node: ProcessCollectionHierarchy) => {
        const { parentNodeWithIcon } = getHierarchicalStructure({ parentNode: node, allNodes: allUserAccessible });
        return parentNodeWithIcon;
    });

    const rootProcessCollection: TreeStructureItem = {
        id: ABSTRACT_ROOT_COLLECTION_ID,
        name: translate('Process.Collection.Structure.Root'),
        parentId: null,
        children: userAccessibleHierarchy,
        icon: accessTooltipIcon.home,
        selectable: isOwner,
    };

    const setSelected = (selected: CollectionId[] | CollectionId) => {
        if (typeof selected === 'string') {
            if (selected === ABSTRACT_ROOT_COLLECTION_ID) {
                handleChange(ROOT_PROCESS_COLLECTION_ID);
                return;
            }
            if (selected === collectionId) return;
            handleChange(selected);
        }
    };

    useEffect(() => {
        dispatch(processCollectionActions.getAllAccessible());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModifyDialogOpen]);

    return (
        <Box sx={{ minHeight: 200, flexGrow: 1 }}>
            <Box display="flex" alignItems="center" gap={1} >
                <Typography variant="body1">
                    {translate('Process.Collection.Structure.Title')}
                </Typography>
                <InfoButtonTooltip message={translate('Process.Edit.Location.Title.Info')} />
            </Box>
            <If condition={!isLoading} else={<LinearProgress />}>
                <TreeStructure
                    currentNodeChildren={[rootProcessCollection]}
                    selected={collectionId ? [collectionId] : []}
                    defaultSelected={[ABSTRACT_ROOT_COLLECTION_ID]}
                    setSelected={setSelected}
                />
            </If>
        </Box>
    );
};

export default LocationOptions;
