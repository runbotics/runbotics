import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import LoadingScreen from '../../../components/utils/LoadingScreen';
import useQuery from '../../../hooks/useQuery';
import useTranslations from '../../../hooks/useTranslations';
import { processCollectionSelector } from '../../../store/slices/ProcessCollection';
import Header, { ProcessesTabs } from '../ProcessBrowseView/Header';

export const ProcessCollectionView = () => {
    const { firstValueFrom } = useQuery();
    const { translate } = useTranslations();
    const { isLoading } = useSelector(processCollectionSelector).childrenCollections;
    const collectionId = firstValueFrom(ProcessesTabs.COLLECTIONS);

    return (
        <InternalPage title={translate('Process.Collection.Navigation.Collections.Label')}>
            <Header />
            {isLoading ?
                <LoadingScreen /> : (
                    <Box pt={6}>
                        <ProcessCollectionList />
                    </Box>
                )}
        </InternalPage>
    );
};

export default ProcessCollectionView;
