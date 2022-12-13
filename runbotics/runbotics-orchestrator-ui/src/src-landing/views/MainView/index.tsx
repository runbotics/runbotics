import React from 'react';

import Layout from '#src-landing/components/Layout';
import BenefitsSection from '#src-landing/views/sections/BenefitsSection';
import HeroSection from '#src-landing/views/sections/HeroSections';


const MainView = () => (
    <Layout>
        <HeroSection />
        <BenefitsSection />
        {/* Add your section here*/}

        {/* This div is used let us see if our section is contained */}
        <div style={{ height:'100vh' }}></div>
    </Layout>
);

export default MainView;
