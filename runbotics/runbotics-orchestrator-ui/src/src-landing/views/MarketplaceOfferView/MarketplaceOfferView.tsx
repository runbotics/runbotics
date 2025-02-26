import { VFC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { BlogPost, MarketplaceOffer } from '#contentful/common';
import TagIcon from '#public/images/icons/category_label.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import BlogSharePanel from '#src-landing/components/BlogSharePanel';
import Layout from '#src-landing/components/Layout';
import PostHeader from '#src-landing/components/PostHeader';
import RichTextRenderer from '#src-landing/components/RichTextRenderer';
import Typography from '#src-landing/components/Typography';

import styles from './MarketplaceOfferView.module.scss';
import BreadcrumbsSection from '../sections/blog/BreadcrumbsSection';

interface Props {
    offer: MarketplaceOffer;
}

const MarketplaceOfferView: VFC<Props> = ({ offer }) => {
    const { body, description, slug: offertSlug, tags: offerTags, ...postHeaderProps } = offer;
    const { translate } = useTranslations();

    const tags = offerTags.items.map(({ name, slug }) => (
        <Link key={name} href={`/marketplace?tag=${slug}`} className={styles.tagLink}>
            {`${name}`}
        </Link>
    ));

    return (
        <Layout>
            <div className={styles.blogWrapper}>
                <div className={styles.breadCrumbsWrapper}>
                    <BreadcrumbsSection subPageTitle={offer.title} />
                </div>
                <article className={styles.contentArticle}>
                    <RichTextRenderer content={body} />
                    <div className={styles.tagsWrapper}>
                        <Image
                            src={TagIcon}
                            width={24}
                            height={24}
                            className={styles.tag}
                            alt="tag icon"
                        />
                        <Typography
                            font="Roboto"
                            className={`${styles.h4} ${styles.tag}`}
                            variant="h4"
                        >
                            {translate('Blog.Post.Tags')}
                        </Typography>
                        {tags}
                    </div>
                    <BlogSharePanel />
                </article>
            </div>
        </Layout>
    );
};

export default MarketplaceOfferView;
