import { FC } from 'react';

import { useRouter } from 'next/router';

import { BlogPost, Page } from '#contentful/common';
import If from '#src-app/components/utils/If';
import CardsSection from '#src-landing/views/sections/blog/CardsSection';

import PaginationNavigation from './PaginationNavigation';
import styles from './PostsPagination.module.scss';
import SwitchPageButton from './SwitchPageButton';

export interface PostsPaginationProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
    cardsSectionRef: React.RefObject<HTMLDivElement>;
    page: Page;
}


const PostsPagination: FC<PostsPaginationProps> = ({ posts, featuredPost, cardsSectionRef, page }) => {
    const router = useRouter();
    const { pathname, query } = router;
    const { current: currentPage, total: totalPages } = page;

    const switchPage = (pageNumber: number) => {
        router.push({
            pathname,
            query: { 
                ...query,
                page: pageNumber,
            },
        });
    };

    return (
        <div className={styles.root}>
            <div className={styles.paginatedPosts}>
                <CardsSection
                    ref={cardsSectionRef}
                    posts={posts}
                    featuredPost={featuredPost}
                />
            </div>
            <If condition={totalPages > 1}>
                <div className={styles.slider}>
                    <If condition={currentPage > 1}>
                        <SwitchPageButton
                            direction='Previous'
                            currentPage={currentPage}
                            switchPage={switchPage}
                        />
                    </If>
                    <PaginationNavigation
                        switchPage={switchPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                    <If condition={currentPage < totalPages}>
                        <SwitchPageButton
                            direction='Next'
                            currentPage={currentPage}
                            switchPage={switchPage}
                        />
                    </If>
                </div>
            </If>
        </div>
    );
};

export default PostsPagination;
