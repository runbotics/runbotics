import React, { VFC, useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';
import { PartialUserDto } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import useClickOutsideComponent from '#src-app/hooks/useClickOutsideComponent';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { usersActions } from '#src-app/store/slices/Users';
import { languages, Language } from '#src-app/translations/translations';

import styles from './LanguageSwitcher.module.scss';
import { capitalizeFirstLetter } from '../../utils/utils';

const LanguageSwitcher: VFC = () => {
    const [toggle, setToggle] = useState(false);
    const dispatch = useDispatch();
    const selectRef = useRef();
    const { isAuthenticated } = useAuth();

    useClickOutsideComponent(selectRef, () => setToggle(false));

    const { switchLanguage, translate } = useTranslations();
    const { push, locale: activeLocale, asPath } = useRouter();

    const updateDatabaseLanguage = async (patchPayload: PartialUserDto) => {
        await dispatch(usersActions.partialUpdate(patchPayload));
    };

    const handleLanguageSwitch = (language: Language) => {
        push(asPath, null, {
            locale: language,
        });
        setToggle(!toggle);
        if (isAuthenticated) {
            updateDatabaseLanguage({ langKey: language });
        }
    };

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        push(asPath, undefined, {
            locale: activeLocale,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLocale]);

    return (
        <div ref={selectRef} className={styles.selectGroup}>
            <button
                onClick={() => setToggle((prevState) => !prevState)}
                className={styles.languageButton}
                data-testid="language-switcher-header-button"
            />
            <div className={toggle ? styles.content : styles.hide}>
                {languages.map((language) => (
                    <div
                        onClick={() => handleLanguageSwitch(language)}
                        key={language}
                        className={`${styles.option} ${
                            language === activeLocale ? styles.active : ''
                        }`}
                        data-testid={`language-switcher-language-${language}`}

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
