import { FC } from 'react';

import Image from 'next/image';

import arrowRight from '#public/images/icons/right.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './SwitchPageButton.module.scss';

const SWITCH_PAGE_BUTTON_SIZE = 30;

interface SwitchPageButtonProps {
    direction: 'Previous' | 'Next';
    currentPage: number;
    switchPage: (pageNumber: number) => void;
}


const SwitchPageButton: FC<SwitchPageButtonProps> = ({ direction, currentPage, switchPage }) => {
    const { translate } = useTranslations();
    
    return (
        <button
            type='button'
            className={styles[direction.toLowerCase()]}
            onClick={() => switchPage(direction === 'Previous' ? currentPage - 1 : currentPage + 1)}
        >
            <Image src={arrowRight} alt={translate(`Landing.Blog.Post.Pagination.${direction}`)} width={SWITCH_PAGE_BUTTON_SIZE} height={SWITCH_PAGE_BUTTON_SIZE} />
        </button>
    );
};

export default SwitchPageButton;
