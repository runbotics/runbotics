import React from 'react';

import Layout from '#src-landing/components/Layout';
import TempLoginButton from '#src-landing/components/TempLoginButton/TempLoginButton';
import BenefitsSection from '#src-landing/views/sections/BenefitsSection';
import HeroSection from '#src-landing/views/sections/HeroSections';
import ProsSection from '#src-landing/views/sections/ProsSection';

const MainView = () => (
    <Layout>
        <HeroSection />
        <BenefitsSection />
        <ProsSection />
        {/* Add your section here*/}

        {/* This div is used let us see if our section is contained */}
        <div style={{ height: '100vh' }}></div>
        <TempLoginButton />
    </Layout>
);

export default MainView;
