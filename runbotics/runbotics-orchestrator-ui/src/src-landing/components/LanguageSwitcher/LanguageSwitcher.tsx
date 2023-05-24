import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './LanguageSwitcher.module.scss';
import useTranslations from '#src-app/hooks/useTranslations';

import { languages, Language } from '#src-app/translations/translations';

export default function LanguageSwitcher() {
    const { switchLanguage, translate } = useTranslations();

    const { push, locale: activeLocale, pathname } = useRouter();

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        push(pathname, undefined, {
            locale: activeLocale,
        });
    }, []);

    return (
        <>
            <div className={styles.selectWrapper}>
                <select
                    onChange={(event) => {
                        switchLanguage(event.target.value as Language);
                        push(pathname, undefined, {
                            locale: event.target.value,
                        });
                    }}
                    className={styles.select}
                >
                    {languages.map((el) => {
                        return (
                            <option
                                key={el}
                                defaultValue={activeLocale}
                                className={styles.option}
                                value={el}
                            >
                                &nbsp;
                                {capitalizeFirstLetter(
                                    translate(`Common.Languages.${el}`)
                                )}
                                &nbsp;
                            </option>
                        );
                    })}
                </select>
            </div>
        </>
    );
}
