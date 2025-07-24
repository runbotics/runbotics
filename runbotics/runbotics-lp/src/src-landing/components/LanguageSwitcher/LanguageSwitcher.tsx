import React, { VFC, useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';

import useClickOutsideComponent from '#src-app/hooks/useClickOutsideComponent';
import useTranslations from '#src-app/hooks/useTranslations';

import { languages, Language } from '#src-app/translations/translations';

import styles from './LanguageSwitcher.module.scss';
import { capitalizeFirstLetter } from '../../utils/utils';

const LanguageSwitcher: VFC = () => {
    const [toggle, setToggle] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);

    useClickOutsideComponent(selectRef, () => setToggle(false));

    const { switchLanguage, translate } = useTranslations();
    const { push, locale: activeLocale, asPath } = useRouter();
    const [prevLocale, setPrevLocale] = useState(activeLocale);

    const handleLanguageSwitch = async (language: Language) => {
        if (language === activeLocale) return;
        setToggle(!toggle);
        await push(asPath, undefined, {
            locale: language,
        });

    };

    useEffect(() => {
        if (activeLocale !== prevLocale) {
            switchLanguage(activeLocale as Language);
            setPrevLocale(activeLocale);
        }
    }, [activeLocale, switchLanguage]);

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
