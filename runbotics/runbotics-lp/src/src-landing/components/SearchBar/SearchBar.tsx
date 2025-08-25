import { ChangeEvent, useEffect, useState, VFC } from 'react';

import Image from 'next/image';

import SearchIcon from '#public/images/icons/search.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './SearchBar.module.scss';

interface Props {
    onClick: (search: string) => void;
    className?: string;
    initialValue?: string;
}

const SearchBar: VFC<Props> = ({ onClick, className, initialValue }) => {
    const { translate } = useTranslations();
    const [search, setSearch] = useState<string>(initialValue ?? '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            onClick(search);
        }, 400);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        setSearch(initialValue ?? '');
    }, [initialValue]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    return (
        <div className={styles.wrapper + ' ' + className}>
            <Image
                className={styles.icon}
                src={SearchIcon}
                alt="search icon"
                width={24}
                height={24}
            />
            <input
                className={styles.input}
                type="text"
                placeholder={translate('Marketplace.Filters.Search')}
                onChange={handleSearch}
                value={search}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        onClick(search);
                    }
                }
                }
            />
        </div>
    );
};

export default SearchBar;
