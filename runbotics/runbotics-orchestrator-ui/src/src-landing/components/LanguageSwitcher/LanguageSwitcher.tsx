import React, { VFC, useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';
import { languages, Language } from '#src-app/translations/translations';

import { capitalizeFirstLetter } from '../../utils/utils';

import styles from './LanguageSwitcher.module.scss';


function useClickOutside(ref, handler) {
    useEffect(() => {
        /**
       * Alert if clicked on outside of element
       */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        }
        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
}

const LanguageSwitcher: VFC = () => {

    const [toggle, setToggle] = useState(false);

    const selectRef = useRef();

    useClickOutside(selectRef, () => setToggle(false));

    const { switchLanguage, translate } = useTranslations();



    const { push, locale: activeLocale, asPath } = useRouter();

    const handleLanguageSwitch = (language: Language) => {
        push(asPath, null, {
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
        <div className={styles.selectGroup}>
            <button onClick= {() => setToggle(!toggle)} className={styles.languageButton} />
            <div ref={selectRef} className={toggle?styles.content:styles.hide}>
                {languages.map((language) => (
                    <div onClick = {() => handleLanguageSwitch(language)} key={language} className={styles.option}>
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
