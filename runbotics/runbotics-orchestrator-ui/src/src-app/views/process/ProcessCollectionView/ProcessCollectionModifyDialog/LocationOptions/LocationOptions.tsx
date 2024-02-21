import React, { useEffect, FC } from 'react';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Typography, Box, LinearProgress } from '@mui/material';
import { CollectionId } from 'runbotics-common';

import TreeStructure from '#src-app/components/TreeStructure';
import { TreeStructureItem } from '#src-app/components/TreeStructure/TreeStructure.types';
import If from '#src-app/components/utils/If';
import useProcessCollection from '#src-app/hooks/useProcessCollection';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processCollectionActions } from '#src-app/store/slices/ProcessCollection';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { LocationOptionsProps } from './LocationOptions.types';
import { ABSTRACT_ROOT_COLLECTION_ID, accessTooltipIcon } from './LocationOptions.utils';
import { ROOT_PROCESS_COLLECTION_ID } from '../../ProcessCollection.utils';

const LocationOptions: FC<LocationOptionsProps> = ({ isOpen, handleChange, parentId = null }) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const { allUserAccessible: { isLoading, list: allUserAccessible } } = useSelector(state => state.processCollection);
    const { userAccessibleHierarchy } = useProcessCollection();

    const rootProcessCollection: TreeStructureItem = {
        id: ABSTRACT_ROOT_COLLECTION_ID,
        name: translate('Process.Collection.Structure.Root'),
        parentId: null,
        children: userAccessibleHierarchy,
        icon: accessTooltipIcon.home,
    };

    const setSelected = (selected: CollectionId[] | CollectionId) => {
        if (typeof selected === 'string') {
            if (selected === ABSTRACT_ROOT_COLLECTION_ID) handleChange('parentId', ROOT_PROCESS_COLLECTION_ID);
            else handleChange('parentId', selected);
        }
    };

    useEffect(() => {
        dispatch(processCollectionActions.getAllAccessible());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

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
                    <TreeStructure currentNodeChildren={[rootProcessCollection]} selected={parentId ? [parentId] : []} defaultSelected={[ABSTRACT_ROOT_COLLECTION_ID]} setSelected={setSelected} />
                </If>
            </If>
        </Box>
    );
};

export default LocationOptions;
