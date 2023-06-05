import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlogPost, DRAFT_BADGE_BACKGROUND_COLOR, checkIsDraft } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
    post: BlogPost;
    className?: string;
}

export const cutText = (text: string, length: number) => {
    if(!text) return null;
    if (text.trim().length < length) {
        return text;
    }
    const cut = text.substring(0, length);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.substring(0, lastSpace) + '...';
};

const BlogCard: FC<BlogCardProps> = ({ post, className }) => {
    const { translate } = useTranslations();

    return (
        <article className={`${styles.root} ${className}`}>
            <Link className={styles.link} href={`/blog/post/${post.slug}`}>
                <div className={styles.wrapper}>
                    {post.featuredImage?.url &&
                        <Image
                            src={post.featuredImage?.url}
                            fill
                            alt={post.imageAlt ?? ''}
                            className={styles.img}
                        />
                    }
                    <If condition={checkIsDraft(post.status)}>
                        <CardBadge
                            className={styles.draftBadge}
                            backgroundColor={DRAFT_BADGE_BACKGROUND_COLOR}
                            text={translate('Blog.Post.DraftBadge')}
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
                            <Typography variant="h4" className={styles.title}>
                                {post.title}
                            </Typography>
                            <Typography variant="body3">
                                {cutText(post.summary, 130)}
                            </Typography>
                        </div>
                        <div className={styles.readMore}>
                            <Typography variant="body3">
                                {translate('Blog.Card.ReadMore')}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default BlogCard;
