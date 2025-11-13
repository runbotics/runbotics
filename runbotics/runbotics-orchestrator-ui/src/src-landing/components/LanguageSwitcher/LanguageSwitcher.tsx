import React, { VFC, useEffect, useState, useRef } from 'react';

import { useRouter } from 'next/router';

import useAuth from '#src-app/hooks/useAuth';
import useClickOutsideComponent from '#src-app/hooks/useClickOutsideComponent';
import useTranslations from '#src-app/hooks/useTranslations';
import LanguageChangeDialog from '#src-app/layouts/MainLayout/TopBar/LangSwitcher/LanguageChangeDialog';
import { useDispatch, useSelector } from '#src-app/store';
import { usersActions } from '#src-app/store/slices/Users';
import { languages, Language } from '#src-app/translations/translations';

import styles from './LanguageSwitcher.module.scss';
import { capitalizeFirstLetter } from '../../utils/utils';

const LanguageSwitcher: VFC = () => {
    const [toggle, setToggle] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pendingLang, setPendingLang] = useState<Language>(null);
    const dispatch = useDispatch();
    const selectRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();

    useClickOutsideComponent(selectRef, () => setToggle(false));

    const { switchLanguage, translate } = useTranslations();
    const { push, locale: activeLocale, asPath } = useRouter();

    const { isSaveDisabled, errors } = useSelector(state => state.process.modeler);

    const updateDatabaseLanguage = async (patchPayload: { langKey: string }) => {
        await dispatch(usersActions.changeLanguageKey(patchPayload));
    };

    const handleLanguageSwitch = (language: Language) => {
        if (language === activeLocale) return;
        if (!isSaveDisabled || errors.length > 0) {
            setPendingLang(language);
            setIsDialogOpen(true);
            setToggle(false);
            
            return;
        }

        push(asPath, null, { locale: language });
        setToggle(prev => !prev);
        if (isAuthenticated) {
            updateDatabaseLanguage({ langKey: language });
        }
    };

    const onConfirm = () => {
        if (!pendingLang) return;
        push(asPath, null, { locale: pendingLang });
        if (isAuthenticated) {
            updateDatabaseLanguage({ langKey: pendingLang });
        }
        switchLanguage(pendingLang);
        setToggle(false);
        setIsDialogOpen(false);
        window.location.reload();
    };

    const onCancel = () => {
        setIsDialogOpen(false);
    };

    useEffect(() => {
        switchLanguage(activeLocale as Language);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLocale]);

    return (
        <>
            <LanguageChangeDialog
                isDialogOpen={isDialogOpen}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
            <div ref={selectRef} className={styles.selectGroup}>
                <button
                    onClick={() => setToggle(prev => !prev)}
                    className={styles.languageButton}
                    data-testid="language-switcher-header-button"
                />
                <div className={toggle ? styles.content : styles.hide}>
                    {languages.map(lang => (
                        <div
                            onClick={() => handleLanguageSwitch(lang)}
                            key={lang}
                            className={`${styles.option} ${lang === activeLocale ? styles.active : ''}`}
                            data-testid={`language-switcher-language-${lang}`}
                        >
                            {capitalizeFirstLetter(
                                translate(`Common.Languages.${lang}`)
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default LanguageSwitcher;
