import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getBlogMainCache, recreateCache } from '#contentful/blog-main';
import { BlogPost } from '#contentful/common';
import HeroBg from '#public/images/banners/hero-background.png';
import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import { Language } from '#src-app/translations/translations';
import { MetadataTags } from '#src-landing/components/Matadata/Metadata';
import MainView from '#src-landing/views/MainView';

interface Props {
    blogPosts: BlogPost[];
}

const IndexPage: VFC<Props> = ({ blogPosts }) => <MainView blogPosts={blogPosts} />;

export const getServerSideProps: GetServerSideProps<Props> = async ({ res, locale }) => {
    let cache = getBlogMainCache(locale as Language);

    if (!cache) {
        cache = await recreateCache(locale as Language);
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const blogPosts = cache.posts?.slice(0, 3) ?? [];

    const metadata: MetadataTags = {
        description: 'RunBotics - Home',
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
