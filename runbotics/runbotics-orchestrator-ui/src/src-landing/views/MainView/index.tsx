import React from 'react';

import Layout from '#src-landing/components/Layout';
import BenefitsSection from '#src-landing/views/sections/BenefitsSection';
import HeroSection from '#src-landing/views/sections/HeroSections';
import IntegrationSection from '#src-landing/views/sections/IntegrationSections';
import ProsSection from '#src-landing/views/sections/ProsSection';

const MainView = () => (
    <Layout>
        <HeroSection />
        <BenefitsSection />
        <ProsSection />
        <IntegrationSection/>
        {/* Add your section here*/}

        {/* This div is used let us see if our section is contained */}
        <div style={{ height: '100vh' }}></div>
    </Layout>
);

export default MainView;
