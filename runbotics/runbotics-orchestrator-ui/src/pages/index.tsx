import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getBlogMainCache } from '#contentful/blog-main';
import { BlogPost, isCached, recreateCache } from '#contentful/common';
import HeroBg from '#public/images/banners/hero-background.png';
import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import { Language } from '#src-app/translations/translations';
import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import MainView from '#src-landing/views/MainView';

interface Props {
    blogPosts: BlogPost[];
}

const IndexPage: VFC<Props> = ({ blogPosts }) => <MainView blogPosts={blogPosts} />;

export const getServerSideProps: GetServerSideProps<Props> = async ({ locale, res }) => {
    const language = locale as Language;

    if (!isCached(language)) {
        await recreateCache(language);
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const cache = getBlogMainCache(language);

    const blogPosts = cache?.posts?.slice(0, 3) ?? [];

    const metadata: MetadataTags = {
        title: language === 'pl' 
            ? 'RunBotics | RPA + AI do automatyzacji procesów w chmurze'
            : 'RunBotics | RPA + AI for process automation in cloud',
        description: language === 'pl' 
            ? 'RunBotics to chmurowa platforma do automatyzacji procesów biznesowych z użyciem AI. Twórz procesy samemu lub z naszego marketplace. Zwiększ efektywność firmy z RunBotics już dziś!'
            : 'RunBotics is a cloud platform for business processes automation with AI. Create processes on your own or select some ready-to-use from our marketplace. Increase your company’s efficiency now!',
        keywords: language === 'pl'
            ? 'runbotics, robotyczna automatyzacja procesów, robotic process automation, automatyzacja procesów biznesowych, business process automation, rpa, ai, sztuczna inteligencja, rpa + ai, narzędzie do automatyzacji, hiperautomatyzacja, open source rpa, narzędzie rpa, rpa github, rpa w chmurze, darmowe narzędzia rpa, subskrypcja rpa, saas rpa, sklep z procesami, process marketplace, biblioteka procesów, rpa microsoft office, powerautomate, rpa do sap, rpa do atlassian, rpa do jira, rpa do confluence, automation anywhere, uipath, make, n8n, enterprise software house, all for one, all for one poland'
            : 'runbotics, robotic process automation, business process automation, rpa, ai, rpa + ai, automation tool, hyperautomation, hyper automation, open source rpa, rpa tool github, rpa in cloud, free rpa tools, rpa subscription, saas rpa, pay-as-you-go rpa, process marketplace, process library, rpa microsoft office, powerautomate, rpa for sap, rpa for Atlassian, rpa for Jira, rpa for confluence, automation anywhere, uipath, make, n8n, enterprise software house, all for one, all for one poland',
        image: HeroBg.src,
    };

    return {
        props: {
            blogPosts,
            metadata,
        },
    };
};

export default withGuestGuard(IndexPage);
