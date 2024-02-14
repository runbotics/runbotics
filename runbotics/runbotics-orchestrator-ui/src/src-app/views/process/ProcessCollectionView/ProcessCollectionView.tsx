import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import ProcessCollectionPath from '#src-app/components/Tile/ProcessCollectionTile/ProcessCollectionPath';
import useProcessCollection from '#src-app/hooks/useProcessCollection';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import If from '../../../components/utils/If';
import LoadingScreen from '../../../components/utils/LoadingScreen';
import useTranslations from '../../../hooks/useTranslations';
import { processCollectionSelector } from '../../../store/slices/ProcessCollection';
import Header from '../ProcessBrowseView/Header';

export const ProcessCollectionView = () => {
    const { translate } = useTranslations();
    const { isLoading } = useSelector(processCollectionSelector).childrenCollections;

    const { currentCollectionId, breadcrumbs } = useProcessCollection();
    return (
        <InternalPage title={translate('Process.Collection.Navigation.Collections.Label')}>
            <Header />
            <Box pt={2}>
                <ProcessCollectionPath
                    breadcrumbs={breadcrumbs}
                    currentCollectionId={currentCollectionId}
                />
                <If condition={!isLoading} else={<LoadingScreen />} >
                    <ProcessCollectionList />
                </If>
            </Box>
        </InternalPage>
    );
};

export default ProcessCollectionView;
