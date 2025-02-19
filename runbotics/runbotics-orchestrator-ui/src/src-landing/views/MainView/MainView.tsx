import { useEffect, type VFC } from 'react';

import { BlogPost } from '#contentful/common';
import { ENTERED_PAGE } from '#src-app/utils/Mixpanel/types';
import { recordPageEntrance } from '#src-app/utils/Mixpanel/utils';
import Layout from '#src-landing/components/Layout';
import AboutTeamSection from '#src-landing/views/sections/AboutTeamSection';
import BenefitsSection from '#src-landing/views/sections/BenefitsSection';
import BlogSection from '#src-landing/views/sections/BlogSection';
import ContactSection from '#src-landing/views/sections/ContactSection';
import HeroSection from '#src-landing/views/sections/HeroSection';
import IntegrationSection from '#src-landing/views/sections/IntegrationSection';
import MarketplaceSection from '#src-landing/views/sections/MarketplaceSection';
import OpenSourceSection from '#src-landing/views/sections/OpenSourceSection';
import PartnerSection from '#src-landing/views/sections/PartnerSection';
import ProsSection from '#src-landing/views/sections/ProsSection';
import ReferencesSection from '#src-landing/views/sections/ReferencesSection/ReferencesSection';
import RPASection from '#src-landing/views/sections/RPASection';

interface Props {
    blogPosts: BlogPost[];
}

const MainView: VFC<Props> = ({ blogPosts }) => {
    useEffect(() => {
        recordPageEntrance({ enteredPage: ENTERED_PAGE.LANDING });
    }, []);

    return (
        <Layout>
            <HeroSection/>
            <BenefitsSection/>
            <RPASection/>
            <ProsSection/>
            <OpenSourceSection/>
            {/* <TemplatesSection /> */}
            <IntegrationSection/>
            <ReferencesSection />
            <PartnerSection/>
            <AboutTeamSection/>
            <BlogSection posts={blogPosts}/>
            <MarketplaceSection offers={[]}/>
            <ContactSection/>
        </Layout>);
};

export default MainView;
