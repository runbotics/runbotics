import React, { VFC, useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';

import useClickOutsideComponent from '#src-app/hooks/useClickOutsideComponent';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './LanguageSwitcher.module.scss';
import { capitalizeFirstLetter } from '../../utils/utils';
import { languages, Language } from '#src-app/translations/translations';

const LanguageSwitcher: VFC = () => {
    const [toggle, setToggle] = useState(false);
    const selectRef = useRef();

    useClickOutsideComponent(selectRef, () => setToggle(false));

    const { switchLanguage, translate } = useTranslations();
    const { push, locale: activeLocale, asPath } = useRouter();

    const handleLanguageSwitch = (language: Language) => {
        push(asPath, null, {
            locale: language,
        });
        setToggle(!toggle);
    };

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        push(asPath, undefined, {
            locale: activeLocale,
        });
    }, [activeLocale]);

    return (
        <div ref={selectRef} className={styles.selectGroup}>
            <button
                onClick={() => setToggle((prevState) => !prevState)}
                className={styles.languageButton}
            />
            <div className={toggle ? styles.content : styles.hide}>
                {languages.map((language) => (
                    <div
                        onClick={() => handleLanguageSwitch(language)}
                        key={language}
                        className={`${styles.option} ${language === activeLocale ? styles.active : ''
                            }`}
                    >
                        {capitalizeFirstLetter(
                            translate(`Common.Languages.${language}`)
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcher;