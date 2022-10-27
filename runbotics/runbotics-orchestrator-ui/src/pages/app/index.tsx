import React from 'react';

import LoadingScreen from 'src/components/utils/LoadingScreen';

const AppPage = () => <LoadingScreen />;

export default AppPage;

export function getServerSideProps() {
    return {
        redirect: {
            destination: '/app/processes',
            permanent: false,
        },
    };
}
