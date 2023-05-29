import React, { VFC, useEffect } from 'react';

import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';
import { languages, Language } from '#src-app/translations/translations';

import {capitalizeFirstLetter} from '../../utils/utils';


import styles from './LanguageSwitcher.module.scss';


const LanguageSwitcher: VFC = () => {
    const { switchLanguage, translate } = useTranslations();

    const { push, locale: activeLocale, asPath } = useRouter();

    const handleLanguageSwitch = (language: Language) => {
        push(asPath, undefined, {
            locale: language,
        });
    };

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        push(asPath, undefined, {
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
