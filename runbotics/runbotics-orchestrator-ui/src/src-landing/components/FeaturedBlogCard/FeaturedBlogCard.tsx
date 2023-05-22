import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlogPost, DRAFT_BADGE_BACKGROUND_COLOR, checkIsDraft } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import { cutText } from '../BlogCard';
import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './FeaturedBlogCard.module.scss';

interface FeaturedBlogCardProps {
    post: BlogPost;
    className?: string;
    brief?: boolean;
}

const FeaturedBlogCard: FC<FeaturedBlogCardProps> = ({ post, className, brief }) => {
    const { translate } = useTranslations();

    if (!post) return null;

    return (
        <article className={`${styles.root} ${className}`}>
            <Link className={styles.link} data-brief={brief} href={`/blog/post/${post.slug}`}>
                <div className={styles.wrapper}>
                    <Image
                        src={post.featuredImage.url}
                        fill
                        alt={post.imageAlt ?? ''}
                        className={styles.img}
                    />
                    <If condition={checkIsDraft(post.status)}>
                        <CardBadge
                            className={styles.draftBadge}
                            text={translate('Blog.Post.DraftBadge')}
                            backgroundColor={DRAFT_BADGE_BACKGROUND_COLOR}
                        />
                    </If>
                    <div className={styles.content}>
                        <div className={styles.info}>
                            <Typography variant="body4">
                                {new Intl.DateTimeFormat().format(new Date(post.date))}
                            </Typography>
                            <Typography variant="body4">
                                {post.readingTime}&nbsp;{translate('Blog.Post.ReadingTime.Unit')}
                            </Typography>
                            <Typography variant="body4" className={styles.category}>
                                {post.category.title}
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="h3" data-brief={brief} className={styles.title}>
                                {post.title}
                            </Typography>
                            {!brief &&
                                <Typography variant="body3" className={styles.description}>
                                    {cutText(post.summary, 230)}
                                </Typography>
                            }
                        </div>
                        <div className={styles.readMore}>
                            <Typography variant="body5">
                                {translate('Blog.Card.ReadMore')}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default FeaturedBlogCard;
