import React, { useEffect, FC } from 'react';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
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

const LocationOptions: FC<LocationOptionsProps> = ({ isModifyDialogOpen, handleChange, isOwner, parentId = null, editedCollectionId }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { allUserAccessible: { isLoading, list: allUserAccessible } } = useSelector(state => state.processCollection);

    const rootCollections = allUserAccessible.filter(collection => collection.parentId === null);
    const userAccessibleHierarchy = rootCollections.map((node: ProcessCollectionHierarchy) => {
        const { parentNodeWithIcon } = getHierarchicalStructure({ parentNode: node, allNodes: allUserAccessible, editedCollectionId });
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
        if (typeof selected !== 'string') { return; }
        if (selected === ABSTRACT_ROOT_COLLECTION_ID) {
            handleChange('parentId', ROOT_PROCESS_COLLECTION_ID);
            return;
        } else
        if (selected === editedCollectionId) { return; }

        handleChange('parentId', selected);
    };

    useEffect(() => {
        dispatch(processCollectionActions.getAllAccessible());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModifyDialogOpen]);

    const noCollectionsMessage = (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Typography variant="body2">
                {translate('Process.Collection.Structure.NoCollections')}
            </Typography>
            <HomeOutlinedIcon />
        </Box>
    );

    return (
        <Box sx={{ minHeight: 200, flexGrow: 1 }}>
            <Box display="flex" alignItems="center" gap={1} >
                <Typography variant="body1">
                    {translate('Process.Collection.Structure.Title')}
                </Typography>
                <InfoButtonTooltip message={translate('Process.Collection.Structure.Title.Info')} />
            </Box>
            <If condition={!isLoading} else={<LinearProgress />}>
                <If condition={allUserAccessible.length > 0} else={noCollectionsMessage}>
                    <TreeStructure
                        currentNodeChildren={[rootProcessCollection]}
                        selected={parentId ? [parentId] : []}
                        defaultSelected={[ABSTRACT_ROOT_COLLECTION_ID]}
                        setSelected={setSelected}
                    />
                </If>
            </If>
        </Box>
    );
};

export default LocationOptions;
