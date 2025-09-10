import { ChangeEvent, VFC, useState, FormEvent, useEffect } from 'react';

import Image from 'next/image';

import SearchIcon from '#public/images/icons/search.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './SearchInput.module.scss';

interface Props {
    onClick: (search: string) => void;
    className?: string;
    initialValue?: string;
}

const SearchInput: VFC<Props> = ({ onClick, className, initialValue }) => {
    const { translate } = useTranslations();
    const [search, setSearch] = useState<string>(initialValue ?? '');

    useEffect(() => {
        setSearch(initialValue ?? '');
    }, [initialValue]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onClick(search);
    };

    return (
        <form
            className={styles.form + ' ' + className}
            onSubmit={handleSubmit}
        >
            <input
                className={styles.input}
                type="text"
                placeholder={translate('Blog.Filters.Search')}
                onChange={handleSearch}
                value={search}
            />
            <button
                className={styles.button}
                type='submit'
            >
                <Image
                    src={SearchIcon}
                    alt="search icon"
                    width={24}
                    height={24}
                />
            </button>
        </form>
    );
};

export default SearchInput;
