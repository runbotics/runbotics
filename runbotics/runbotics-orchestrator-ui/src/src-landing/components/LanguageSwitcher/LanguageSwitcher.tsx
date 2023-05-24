import { languages, Language } from '#src-app/translations/translations';


import styles from './LanguageSwitcher.module.scss';

import useTranslations from '#src-app/hooks/useTranslations';

import React, { VFC, useEffect } from 'react';

import { useRouter } from 'next/router';

const LanguageSwitcher: VFC = () => {
    const { switchLanguage, translate } = useTranslations();

    const { push, locale: activeLocale, pathname } = useRouter();




    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleLanguageSwitch = (language: Language) => {
        switchLanguage(language);
    }

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        push(pathname, undefined, {
            locale: activeLocale,
        });
    }, []);

    return (
       
            <div className={styles.selectWrapper}>
                <select
                    onChange={(event) => handleLanguageSwitch(event.target.value as Language)}
                    className={styles.select}
                >
                    {languages.map((language) => {
                        return (
                            <option
                                key={language}
                                defaultValue={activeLocale}
                                className={styles.option}
                                value={language}
                            >
                                {capitalizeFirstLetter(
                                    translate(`Common.Languages.${language}`)
                                )}
                                &nbsp;
                            </option>
                        );
                    })}
                </select>
            </div>
       
    );
}

export default LanguageSwitcher
