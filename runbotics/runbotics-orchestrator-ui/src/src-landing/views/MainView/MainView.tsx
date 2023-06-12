import type { VFC } from 'react';

import { BlogPost } from '#contentful/common';
import Layout from '#src-landing/components/Layout';
import BenefitsSection from '#src-landing/views/sections/BenefitsSection';
import BlogSection from '#src-landing/views/sections/BlogSection';
import ContactSection from '#src-landing/views/sections/ContactSection';
import HeroSection from '#src-landing/views/sections/HeroSection';
import IntegrationSection from '#src-landing/views/sections/IntegrationSection';
import OpenSourceSection from '#src-landing/views/sections/OpenSourceSection';
import PartnerSection from '#src-landing/views/sections/PartnerSection';
import ProsSection from '#src-landing/views/sections/ProsSection';
import RPASection from '#src-landing/views/sections/RPASection';

interface Props {
    blogPosts: BlogPost[];
}

const MainView: VFC<Props> = ({ blogPosts }) => (
    <Layout>
        <HeroSection />
        <BenefitsSection />
        <RPASection />
        <ProsSection />
        <OpenSourceSection />
        {/* <TemplatesSection /> */}
        <IntegrationSection />
        <PartnerSection />
        <BlogSection posts={blogPosts} />
        <ContactSection />
    </Layout>
);

export default MainView;
