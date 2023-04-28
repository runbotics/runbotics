import React from 'react';



import useTranslations from '#src-app/hooks/useTranslations';

import styles from './FiltersSection.module.scss';

const FiltersSection = () => {
    const { translate } = useTranslations();

    const handleSearch = () => {
        console.log('handleSearch');
    };

    return (
        <div className={styles.root}>
            <div className={styles.search}>
                <img className={styles.icon} src="/images/icons/search-black.svg" alt="search"/>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Search"
                    onChange={handleSearch}
                />
            </div>
        </div>

    );
};

export default FiltersSection;
