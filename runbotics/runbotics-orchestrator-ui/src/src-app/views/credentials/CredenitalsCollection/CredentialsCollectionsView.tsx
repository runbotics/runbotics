
import { Box } from '@mui/material';

import InternalPage from '#src-app/components/pages/InternalPage';

import useTranslations from '#src-app/hooks/useTranslations';

import Header from '../Header';


export const CredentialsCollectionsView = () => {
    const {translate} = useTranslations();

    return (
        <InternalPage title={`Credentials ${translate('Credentials.Tab.Collections')}`}>
            {/* <TileGrid className={classes.cardsWrapper}>
               
            </TileGrid> */}
            <Header />
            <Box mt={6} display="flex" justifyContent="center">
                Tu będzie kolekcja kredek
            </Box>
        </InternalPage>
    ); };

export default CredentialsCollectionsView;
