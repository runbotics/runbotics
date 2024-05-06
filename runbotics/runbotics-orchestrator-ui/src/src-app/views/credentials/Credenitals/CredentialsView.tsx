
import { Box } from '@mui/material';


import InternalPage from '#src-app/components/pages/InternalPage';
import useTranslations from '#src-app/hooks/useTranslations';

import Header from '../Header';


export const CredentialsView = () => {
    const { translate } = useTranslations();

    return (
        <InternalPage title={translate('Credentials.Tab.Credentials')}>
            <Header/>
            <Box mt={6} display="flex" justifyContent="center">
                Tu będzie lista wszystkich kredek
            </Box>
        </InternalPage>
    );
};

export default CredentialsView;
