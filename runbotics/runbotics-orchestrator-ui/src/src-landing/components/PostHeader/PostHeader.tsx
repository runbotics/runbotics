import { VFC } from 'react';

import Image from 'next/image';




import { BlogPost } from '#contentful/common';
import CalendarIcon from '#public/images/icons/calendar.svg';
import CategoryIcon from '#public/images/icons/category_label.svg';
import CoffeeIcon from '#public/images/icons/coffee.svg';
import ToyIcon from '#public/images/icons/toy.svg';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { DRAFT_BADGE_BACKGROUND_COLOR, checkIsDraft } from 'src/pages/blog/utils';

import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './PostHeader.module.scss';


type Props = Omit<
    BlogPost,
    'slug' | 'summary' | 'body'
>;

const PostHeader: VFC<Props> = (props) => {
    const { translate } = useTranslations();
    const tags = props.tags?.items.map(({ name }) => <CardBadge key={name} text={name} />);

    return (
        <div className={styles.wrapper}>
            <Image
                className={styles.featuredImage}
                src={props.featuredImage?.url}
                alt={props.imageAlt ?? ''}
                fill
            />
            <div className={styles.info}>
                <div className={styles.tagContainer}>
                    <If condition={checkIsDraft(props.status)}>
                        <CardBadge className={styles.draftBadge} text={translate('Landing.Blog.Post.DraftBadge')} backgroundColor={DRAFT_BADGE_BACKGROUND_COLOR} />
                    </If>
                    {tags}
                </div>
                <div>
                    <Typography variant='h1' color='secondary'>
                        {props.title}
                    </Typography>
                </div>
                <div className={styles.details}>
                    <div title={translate('Landing.Blog.Post.PublicationDate')}>
                        <Image
                            src={CalendarIcon}
                            alt='publication date icon'
                            width={24}
                            height={24}
                            priority
                        />
                        <Typography className={styles.detailTitle} variant='h6'>
                            {new Intl.DateTimeFormat().format(new Date(props.date))}
                        </Typography>
                    </div>
                    <div title={translate('Landing.Blog.Post.ReadingTime')}>
                        <Image src={CoffeeIcon} width={24} height={24} alt='reading time icon' />
                        <Typography className={styles.detailTitle} variant='h6'>
                            {props.readingTime}&nbsp;{translate('Landing.Blog.Post.ReadingTime.Unit')}
                        </Typography>
                    </div>
                    <div title={translate('Landing.Blog.Post.Category')}>
                        <Image src={CategoryIcon} width={24} height={24} alt='category icon' />
                        <Typography className={styles.detailTitle} variant='h6'>
                            {props.category.title}
                        </Typography>
                    </div>
                    <div title={translate('Landing.Blog.Post.Author')}>
                        <Image src={ToyIcon} width={24} height={24} alt='author icon' />
                        <Typography className={styles.detailTitle} variant='h6'>
                            {props.authors.items.map(item => item.name).join(', ')}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostHeader;
