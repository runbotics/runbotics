import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import { BlogPost } from 'src/contentful/models';

import { cutText } from '../BlogCard';
import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './FeaturedBlogCard.module.scss';

interface FeaturedBlogCardProps {
    post: BlogPost;
}
const FeaturedBlogCard: FC<FeaturedBlogCardProps> = ({ post }) => {
    const { translate } = useTranslations();
    if(!post) return null;

    return (
        <div className={styles.root}>
            <Link className={styles.link} href={`/blog/post/${post.slug}`}>
                <article className={styles.article}>
                    <div className={styles.content}>
                        <Image
                            src={post.featuredImage.url}
                            fill
                            alt=""
                            className={styles.img}
                        />
                        <div className={styles.info}>
                            <CardBadge text={post.category.title} />
                            <Typography variant="body4">
                                {new Intl.DateTimeFormat().format(new Date(post.date))}
                            </Typography>
                            <Typography variant="body4" className={styles.category}>
                                {post.category.title}
                            </Typography>
                        </div>
                        <Typography variant="h3" className={styles.title}>
                            {post.title}
                        </Typography>
                        <Typography variant="body3" className={styles.description}>
                            {cutText(post.summary, 230)}
                        </Typography>
                        <div className={styles.readMore}>
                            <Typography variant="body5">
                                {translate('Landing.Blog.Card.ReadMore')}
                            </Typography>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    );
};

export default FeaturedBlogCard;
