import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { getPaginatedUrl } from '#contentful/common';
import arrowRight from '#public/images/icons/right.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './SwitchPageButton.module.scss';

const ARROW_SIZE = 30;

interface SwitchPageButtonProps {
    direction: 'Previous' | 'Next';
    currentPage: number;
}


const SwitchPageButton: FC<SwitchPageButtonProps> = ({ direction, currentPage }) => {
    const { translate } = useTranslations();
    const currentUrl = window.location.href;
    const paginatedUrl = getPaginatedUrl(
        direction === 'Previous' ?
            currentPage - 1 :
            currentPage + 1,
        currentUrl.split('?')[1]
    );
    
    return (
        <Link 
            className={styles[direction.toLowerCase()]}
            href={paginatedUrl}
            title={translate(`Landing.Blog.Post.Pagination.${direction}`)}
        >
            <Image
                src={arrowRight}
                alt={translate(`Landing.Blog.Post.Pagination.${direction}`)}
                width={ARROW_SIZE}
                height={ARROW_SIZE}
            />
        </Link>
    );
};

export default SwitchPageButton;
