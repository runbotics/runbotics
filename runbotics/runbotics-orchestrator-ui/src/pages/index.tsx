import React from 'react';

import LoadingScreen from 'src/components/utils/LoadingScreen';

const IndexPage = () => <LoadingScreen />;

export default IndexPage;

export function getServerSideProps() {
    return {
        redirect: {
            destination: '/app/processes',
            permanent: false,
        },
    };
}
