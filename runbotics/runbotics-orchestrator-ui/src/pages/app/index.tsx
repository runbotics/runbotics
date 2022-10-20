import React from 'react';

const AppPage = () => {
    return <div>Redirect to app/processes</div>;
};

export default AppPage;

export async function getServerSideProps(context) {
    return {
        redirect: {
            destination: '/app/processes',
            permanent: false,
        },
    };
}
