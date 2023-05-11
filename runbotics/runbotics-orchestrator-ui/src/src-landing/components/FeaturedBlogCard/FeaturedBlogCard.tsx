import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { DRAFT_BADGE_BACKGROUND_COLOR, checkIsDraft } from 'src/pages/blog/utils';

import { cutText } from '../BlogCard';
import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './FeaturedBlogCard.module.scss';

interface FeaturedBlogCardProps {
    post: BlogPost;
}

const FeaturedBlogCard: FC<FeaturedBlogCardProps> = ({ post }) => {
    const { translate } = useTranslations();

    if (!post) return null;

    const tags = post.tags?.items.map(({ name }) => <CardBadge key={name} text={name} />);

    return (
        <article className={styles.root}>
            <Link className={styles.link} href={`/blog/post/${post.slug}`}>
                <div className={styles.wrapper}>
                    <Image
                        src={post.featuredImage.url}
                        fill
                        alt={post.imageAlt ?? ''}
                        className={styles.img}
                    />
                    <If condition={checkIsDraft(post.status)}>
                        <CardBadge className={styles.draftBadge} text={translate('Landing.Blog.Post.DraftBadge')} backgroundColor={DRAFT_BADGE_BACKGROUND_COLOR} />
                    </If>
                    <div className={styles.content}>
                        <div className={styles.info}>
                            {tags}
                            <Typography variant="body4">
                                {new Intl.DateTimeFormat().format(new Date(post.date))}
                            </Typography>
                            <Typography variant="body4">
                                {post.readingTime}&nbsp;{translate('Landing.Blog.Post.ReadingTime.Unit')}
                            </Typography>
                            <Typography variant="body4" className={styles.category}>
                                {post.category.title}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="h3" className={styles.title}>
                                {post.title}
                            </Typography>
                            <Typography variant="body3" className={styles.description}>
                                {cutText(post.summary, 230)}
                            </Typography>
                        </div>
                        <div className={styles.readMore}>
                            <Typography variant="body5">
                                {translate('Landing.Blog.Card.ReadMore')}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default FeaturedBlogCard;
