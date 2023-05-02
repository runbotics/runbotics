import { VFC } from 'react';

import Image from 'next/image';

import { BlogPost } from '#contentful/models';
import CalendarIcon from '#public/images/icons/calendar.svg';
import CategoryIcon from '#public/images/icons/category_label.svg';
import ToyIcon from '#public/images/icons/toy.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import CardBadge from '../CardBadge';
import Typography from '../Typography';
import styles from './PostHeader.module.scss';

interface Props extends Pick<BlogPost, 'authors' | 'category' | 'tags' | 'date' | 'title'> {
    imageUrl: string;
}

const PostHeader: VFC<Props> = (props) => {
    const { translate } = useTranslations();
    const tags = props.tags?.map(tag => <CardBadge key={tag} text={tag.toUpperCase()} />);

    return (
        <div className={styles.wrapper}>
            <Image className={styles.featuredImage} src={props.imageUrl} alt='' fill />
            <div className={styles.info}>
                <div className={styles.tagContainer}>
                    {tags}
                </div>
                <div>
                    <Typography variant='h1' color='secondary'>
                        {props.title}
                    </Typography>
                </div>
                <div className={styles.details}>
                    <div title={translate('Landing.Blog.Post.PublicationDate')}>
                        <Image src={CalendarIcon} width={24} height={24} alt='publication date icon' />
                        <Typography variant='h6'>
                            {new Intl.DateTimeFormat().format(new Date(props.date))}
                        </Typography>
                    </div>
                    <div title={translate('Landing.Blog.Post.Category')}>
                        <Image src={CategoryIcon} width={24} height={24} alt='category icon' />
                        <Typography variant='h6'>
                            {props.category.title}
                        </Typography>
                    </div>
                    <div title={translate('Landing.Blog.Post.Author')}>
                        <Image src={ToyIcon} width={24} height={24} alt='author icon' />
                        <Typography variant='h6'>
                            {props.authors.items.map(item => item.name).join(', ')}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostHeader;
