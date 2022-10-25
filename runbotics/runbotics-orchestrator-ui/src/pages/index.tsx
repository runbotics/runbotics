import React from 'react';
import LoadingScreen from 'src/components/utils/LoadingScreen';

const IndexPage = () => {
    return <LoadingScreen />;
};

export default IndexPage;

export async function getServerSideProps(context) {
    return {
        redirect: {
            destination: '/app/processes',
            permanent: false,
        },
    };
}
