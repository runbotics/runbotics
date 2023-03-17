import React from 'react';

import Layout from '#src-landing/components/Layout';
import BenefitsSection from '#src-landing/views/sections/BenefitsSection';
import ContactSection from '#src-landing/views/sections/ContactSection';
import HeroSection from '#src-landing/views/sections/HeroSections';
import IndustriesSection from '#src-landing/views/sections/IndustriesSection';
import IntegrationSection from '#src-landing/views/sections/IntegrationSections';
import OpenSourceSection from '#src-landing/views/sections/OpenSourceSection';
import PartnerSection from '#src-landing/views/sections/PartnerSection';
import ProsSection from '#src-landing/views/sections/ProsSection';
import RPASection from '#src-landing/views/sections/RPASections';
import TemplatesSection from '#src-landing/views/sections/TemplatesSection';

const MainView = () => (
    <Layout>
        <HeroSection />
        <BenefitsSection />
        <RPASection />
        <ProsSection />
        {/* <IndustriesSection /> */}
        <OpenSourceSection />
        {/* <TemplatesSection /> */}
        <IntegrationSection />
        <PartnerSection />
        <ContactSection />
    </Layout>
);

export default MainView;
