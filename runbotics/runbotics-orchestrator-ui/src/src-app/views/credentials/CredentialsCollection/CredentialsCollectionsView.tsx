
import { Box } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';

import useTranslations from '#src-app/hooks/useTranslations';

import GridView from '../GridView';
import Header from '../Header';


export const CredentialsCollectionsView = () => {
    const {translate} = useTranslations();

    return (
        <InternalPage title={`Credentials ${translate('Credentials.Tab.Collections')}`}>
            <Header />
            <Box display="flex" flexDirection="column" gap="1.5rem" marginTop="1.5rem">
                <GridView credentials={[]}/>
            </Box>
        </InternalPage>
    ); };

export default CredentialsCollectionsView;
