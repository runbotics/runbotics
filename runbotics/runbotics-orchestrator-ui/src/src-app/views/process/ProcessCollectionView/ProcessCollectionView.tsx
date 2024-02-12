import { Box } from '@mui/material';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import useQuery from '../../../hooks/useQuery';
import Header, { ProcessesTabs } from '../ProcessBrowseView/Header';

export const ProcessCollectionView = () => {
    const { firstValueFrom } = useQuery();
    const collectionId = firstValueFrom(ProcessesTabs.COLLECTIONS);

    return (
        <InternalPage title="Processes Collections">
            <Header />
            <Box pt={6}>
                <ProcessCollectionList />
            </Box>
        </InternalPage>
    );
};

export default ProcessCollectionView;
