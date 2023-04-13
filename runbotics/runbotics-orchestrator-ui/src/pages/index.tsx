import React from 'react';

import { withGuestGuard, withGuestGuardSSR } from '#src-app/components/guards/GuestGuard';
import MainView from '#src-landing/views/MainView';

const IndexPage = () => <MainView />;

export default withGuestGuard(IndexPage);

export const getServerSideProps = withGuestGuardSSR();
