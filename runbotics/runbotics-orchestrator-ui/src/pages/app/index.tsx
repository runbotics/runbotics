import React from 'react';
import LoadingScreen from 'src/components/utils/LoadingScreen';

const AppPage = () => <LoadingScreen />;

export default AppPage;

export async function getServerSideProps(context) {
    return {
        redirect: {
            destination: '/app/processes',
            permanent: false,
        },
    };
}
