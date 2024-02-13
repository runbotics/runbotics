import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import LoadingScreen from '../../../components/utils/LoadingScreen';
import useQuery from '../../../hooks/useQuery';
import { processCollectionSelector } from '../../../store/slices/ProcessCollection';
import Header, { ProcessesTabs } from '../ProcessBrowseView/Header';

export const ProcessCollectionView = () => {
    const { firstValueFrom } = useQuery();
    const { isLoading } = useSelector(processCollectionSelector).childrenCollections;
    const collectionId = firstValueFrom(ProcessesTabs.COLLECTIONS);

    return (
        <InternalPage title="Processes Collections">
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
