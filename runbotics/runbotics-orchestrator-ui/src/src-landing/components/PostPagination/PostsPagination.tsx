import { FC, useState } from 'react';

import { useRouter } from 'next/router';

import { BlogPost } from '#contentful/common';
import If from '#src-app/components/utils/If';
import CardsSection from '#src-landing/views/sections/blog/CardsSection';

import PaginationNavigation from './PaginationNavigation';
import styles from './PostsPagination.module.scss';
import SwitchPageButton from './SwitchPageButton';

export interface PostsPaginationProps {
    posts: BlogPost[];
    featuredPost?: BlogPost;
    cardsSectionRef: React.RefObject<HTMLDivElement>;
    currentPage?: number;
    postsPerPage?: number;
}


const PostsPagination: FC<PostsPaginationProps> = ({ posts, featuredPost, cardsSectionRef  }) => {
    const [tempCurrentPage, setTempCurrentPage] = useState(1);
    // const tempPages = [1, 2];
    // const tempPages = [1, 2, 3];
    // const tempPages = [1, 2, 3, 4];
    // const tempPages = [1, 2, 3, 4, 5];
    // const tempPages = [1, 2, 3, 4, 5, 6];
    // const tempPages = [1, 2, 3, 4, 5, 6, 7];
    // const tempPages = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const tempPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    const router = useRouter();
    const { pathname } = router;

    const switchPage = (pageNumber: number) => {
        setTempCurrentPage(pageNumber);
        // router.push({
        //     pathname,
        //     query: { 
        //         page: pageNumber,
        //     },
        // });
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
            <If condition={tempPages.length > 1}>
                <div className={styles.slider}>
                    <If condition={tempCurrentPage > 1}>
                        <SwitchPageButton
                            direction='Previous'
                            currentPage={tempCurrentPage}
                            switchPage={switchPage}
                        />
                    </If>
                    <PaginationNavigation
                        switchPage={switchPage}
                        currentPage={tempCurrentPage}
                        totalPages={tempPages.length}
                    />
                    <If condition={tempCurrentPage < tempPages.length}>
                        <SwitchPageButton
                            direction='Next'
                            currentPage={tempCurrentPage}
                            switchPage={switchPage}
                        />
                    </If>
                </div>
            </If>
        </div>
    );
};

export default PostsPagination;
