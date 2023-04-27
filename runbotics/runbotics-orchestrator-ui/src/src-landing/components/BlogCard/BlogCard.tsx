import React, { FC } from 'react';

import Image from 'next/image';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import { BlogPost } from 'src/contentful/models';

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

    return (
        <div className={styles.root}>
            <Link className={styles.link} href={`/blog/post/${post.slug}`}>
                <article className={styles.article}>
                    <Image
                        src={post.featuredImage?.url}
                        fill
                        alt=""
                        className={styles.img}
                    />
                    {/* temp solution to tags, to be added in contentful schema */}
                    {post.category.slug === 'category-two' ? (
                        <CardBadge
                            text={post.category.title}
                            className={styles.badge}
                        />
                    ) : null}
                    <div className={styles.info}>
                        <Typography variant="body4">
                            {new Intl.DateTimeFormat().format(new Date(post.date))}
                        </Typography>
                        <Typography variant="body4" className={styles.category}>
                            {post.category.title}
                        </Typography>
                    </div>
                    <div className={styles.content}>
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
                </article>
            </Link>
        </div>
    );
};

export default BlogCard;
