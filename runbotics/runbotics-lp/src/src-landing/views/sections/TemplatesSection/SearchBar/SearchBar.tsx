import { FC } from 'react';

import Image from 'next/image';

import searchIconSrc from '#public/images/icons/search-light.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './SearchBar.module.scss';
import { SearchBarProps } from './SearchBar.types';

const SearchBar:FC<SearchBarProps> = ({
    searchValue,
    handleSearch,
}) => {
    const { translate } = useTranslations();

    return (
        <div className={styles.root}>
            <div className={styles.searchIcon}>
                <Image src={searchIconSrc} alt={translate('Landing.Templates.SearchBar.ImgSearch')} />
            </div>
            <input 
                className={styles.searchBar} 
                onChange={handleSearch} 
                value={searchValue} 
                placeholder={translate('Landing.Templates.SearchBar.Placeholder')} 
            />
        </div>
    );
};

export default SearchBar;
