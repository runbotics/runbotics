import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlogPost } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';

import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
    post: BlogPost;
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

const BlogCard: FC<BlogCardProps> = ({ post }) => {
    const { translate } = useTranslations();

    const tags = post.tags?.items.map(({ name }) => <CardBadge
        key={name}
        text={name}
        className={styles.badge}
    />);

    return (
        <article className={styles.root}>
            <Link className={styles.link} href={`/blog/post/${post.slug}`}>
                <div className={styles.wrapper}>
                    <Image
                        src={post.featuredImage?.url}
                        fill
                        alt={post.imageAlt ?? ''}
                        className={styles.img}
                    />
                    {tags}
                    <div className={styles.content}>
                        <div className={styles.info}>
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
                            <Typography variant="h4" className={styles.title}>
                                {post.title}
                            </Typography>
                            <Typography variant="body3">
                                {cutText(post.summary, 130)}
                            </Typography>
                        </div>
                        <div className={styles.readMore}>
                            <Typography variant="body3">
                                {translate('Landing.Blog.Card.ReadMore')}
                            </Typography>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default BlogCard;
