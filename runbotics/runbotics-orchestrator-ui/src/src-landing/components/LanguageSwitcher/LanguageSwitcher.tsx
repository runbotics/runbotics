import React, { VFC, useEffect } from 'react';

import { useRouter } from 'next/router';


import useTranslations from '#src-app/hooks/useTranslations';
import { languages, Language } from '#src-app/translations/translations';

import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher: VFC = () => {
    const { switchLanguage, translate } = useTranslations();

    const { push, locale: activeLocale, pathname } = useRouter();

    const capitalizeFirstLetter = (string: string) =>
        string.charAt(0).toUpperCase() + string.slice(1);

    const handleLanguageSwitch = (language: Language) => {
        push(pathname, undefined, {
            locale: language,
        });
    };

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        push(pathname, undefined, {
            locale: activeLocale,
        });
    }, [activeLocale]);

    return (
        <div className={styles.selectWrapper}>
            <select
                onChange={(event) =>
                    handleLanguageSwitch(event.target.value as Language)
                }
                className={styles.select}
                defaultValue={activeLocale}
            >
                {languages.map((language) => (
                    <option
                        key={language}
                        className={styles.option}
                        value={language}
                    >
                        {capitalizeFirstLetter(
                            translate(`Common.Languages.${language}`)
                        )}
                        &nbsp;
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSwitcher;
