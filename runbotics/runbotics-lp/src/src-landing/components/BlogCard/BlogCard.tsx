import React, { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BlogPost, DRAFT_BADGE_BACKGROUND_COLOR, checkIsDraft } from '#contentful/common';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { CLICKABLE_ITEM } from '#src-app/utils/Mixpanel/types';
import { identifyPageByUrl, recordItemClick } from '#src-app/utils/Mixpanel/utils';

import styles from './BlogCard.module.scss';
import CardBadge from '../CardBadge';
import Typography from '../Typography';


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
    const { pathname } = useRouter();

    return (
        <article className={`${styles.root} ${className}`}>
            <Link
                className={styles.link}
                onClick={() => recordItemClick({
                    sourcePage: identifyPageByUrl(pathname),
                    itemName: CLICKABLE_ITEM.BLOG_POST,
                    extraProperties: {
                        title: post.slug,
                        readingTime: post.readingTime,
                    }
                })}
                href={`/blog/post/${post.slug}`}>
                <div className={styles.wrapper}>
                    {post.featuredImage?.url &&
                        <Image
                            src={`${post.featuredImage.url}?w=384`}
                            fill
                            alt={post.imageAlt ?? ''}
                            className={styles.img}
                            sizes='(max-width: 1920px) 80vw, 20vw'
                            placeholder='empty'
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
                                {cutText(post.title, 65)}
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
