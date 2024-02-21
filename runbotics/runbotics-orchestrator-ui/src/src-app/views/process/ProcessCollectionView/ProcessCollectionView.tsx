import { Box } from '@mui/material';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import useQuery from '../../../hooks/useQuery';
import Header from '../ProcessBrowseView/Header';
import ProcessList from '../ProcessBrowseView/ProcessList';

export const ProcessCollectionView = () => {
    const { firstValueFrom } = useQuery();

    return (
        <InternalPage title="Processes Collections">
            <Header />
            <Box pt={5}>
                <ProcessCollectionList />
                <ProcessList />
            </Box>
        </InternalPage>
    );
};

export default ProcessCollectionView;
