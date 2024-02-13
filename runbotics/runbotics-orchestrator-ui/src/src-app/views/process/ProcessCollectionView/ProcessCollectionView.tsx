import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import If from '../../../components/utils/If';
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
            <If condition={!isLoading} else={<LoadingScreen />} >
                <Box pt={6}>
                    <ProcessCollectionList />
                </Box>
            </If>
        </InternalPage>
    );
};

export default ProcessCollectionView;
