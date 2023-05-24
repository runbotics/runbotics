import type { VFC } from 'react';

import { GetServerSideProps } from 'next';

import { getBlogMainCache, recreateCache } from '#contentful/blog-main';
import { BlogPost } from '#contentful/common';
import { withGuestGuard } from '#src-app/components/guards/GuestGuard';
import MainView from '#src-landing/views/MainView';

interface Props {
    blogPosts: BlogPost[];
}

const IndexPage: VFC<Props> = ({ blogPosts }) => <MainView blogPosts={blogPosts} />;

export const getServerSideProps: GetServerSideProps<Props> = async ({ res }) => {
    let cache = getBlogMainCache();

    if (!cache) {
        cache = await recreateCache();
    } else {
        res.setHeader('X-Cache', 'HIT');
    }

    const blogPosts = cache.posts?.slice(0, 3) ?? [];


    return {
        props: {
            blogPosts,
        },
    };
};

export default withGuestGuard(IndexPage);
