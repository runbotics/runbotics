import React, { FC } from 'react';

import moment from 'moment';
import Image from 'next/image';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import { BlogPost } from 'src/contentful/models';

import Typography from '../Typography';
import styles from './FeaturedBlogCard.module.scss';

interface Props {
    post: BlogPost;
}

export const cutText = (text: string, length: number) => {
    if (text.length < length) {
        return text;
    }
    const cut = text.substring(0, length);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.substring(0, lastSpace) + '...';
};

const BlogCard: FC<Props> = ({ post }) => {
    const { translate } = useTranslations();

    return (
        <article className={styles.root}>
            <div className={styles.content}>
                <Image
                    src={post.featuredImage.url}
                    fill
                    alt=""
                    className={styles.img}
                />
                <div className={styles.info}>
                    <Typography variant="body4">
                        {moment(post.date).format('D.MM.YYYY')}
                    </Typography>
                    <Typography variant="body4" className={styles.category}>
                        {post.categories.items[0].title}
                    </Typography>
                </div>
                <Typography variant="h3" className={styles.title}>
                    {post.title}
                </Typography>
                <Typography variant="body3" className={styles.description}>
                    {cutText(post.summary, 230)}
                </Typography>
                <div className={styles.readMore}>
                    <Link href={`/blog/${post.slug}`}>
                        <Typography variant="body5">
                            {translate('Landing.Blog.Card.ReadMore')}
                        </Typography>
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;
