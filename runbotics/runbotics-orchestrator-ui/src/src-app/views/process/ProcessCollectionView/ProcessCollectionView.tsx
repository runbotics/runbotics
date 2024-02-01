import { Box } from '@mui/material';
import InternalPage from '../../../components/pages/InternalPage';
import Header from '../ProcessBrowseView/Header';
import useQuery from '../../../hooks/useQuery';

export const ProcessCollectionView = () => {
    const { firstValueFrom } = useQuery();
    const collectionId = firstValueFrom('collection')

    return (
        <InternalPage title="Processes Collections">
            <Header />
            <Box mt={6}>
                {
                // TODO: display collection folders 
                `Current collection id:  ${collectionId}`
                }
            </Box>
        </InternalPage>
    );
};

export default ProcessCollectionView;
