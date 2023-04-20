import React, { FC } from 'react';

import moment from 'moment';
import Image from 'next/image';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import { BlogPost } from 'src/contentful/models';

import Typography from '../Typography';
import styles from './BlogCard.module.scss';

interface BlogCardProps {
    post: BlogPost;
}

export const cutText = (text: string, length: number) => {
    if(!text) return null;
    if (text.length < length) {
        return text;
    }
    const cut = text.substring(0, length);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.substring(0, lastSpace) + '...';
};

const BlogCard: FC<BlogCardProps> = ({ post }) => {
    const { translate } = useTranslations();

    return (
        <article className={styles.root}>
            <Image
                src={post.featuredImage?.url}
                fill
                alt=""
                className={styles.img}
            />
            {/* temp solution to tags, to be added in contentful schema */}
            {/* {post.categories.items[0]?.slug === 'category-two' ? (
                <CardBadge
                    text={post.categories.items[0].title}
                    className={styles.badge}
                />
            ) : null} */}
            <div className={styles.info}>
                <Typography variant="body4">
                    {moment(post.date).format('D.MM.YYYY')}
                </Typography>
                {/* <Typography variant="body4" className={styles.category}>
                    {post.categories.items[0]?.title}
                </Typography> */}
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
                <Link href={`/blog/${post.slug}`}>
                    <Typography variant="body3">
                        {translate('Landing.Blog.Card.ReadMore')}
                    </Typography>
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;
