import React, { ChangeEvent, useState } from 'react';
import {
    Select, MenuItem, InputLabel,
} from '@mui/material';
import {
    languages, TranslationsDescriptors, DEFAULT_LANG, Language,
} from 'src/translations/translations';
import useTranslations from 'src/hooks/useTranslations';
import { LangFormControl } from './LangSwitcher.styled';

const LangSwitcher = () => {
    const [selectedLang, setSelectedLang] = useState<Language>(DEFAULT_LANG);
    const { translate, switchLanguage } = useTranslations();

    const onSwitchLang = (e: ChangeEvent<HTMLInputElement>) => {
        const lang = e.target.value as Language;
        setSelectedLang(lang);
        switchLanguage(lang);
    };

    return (
        <LangFormControl size="small">
            <Select
                value={selectedLang}
                onChange={onSwitchLang}
            >
                {
                    languages.map((lang) => (
                        <MenuItem
                            value={lang}
                            key={lang}
                        >
                            {translate(`Common.Languages.${lang}` as keyof TranslationsDescriptors)}
                        </MenuItem>
                    ))
                }
            </Select>
        </LangFormControl>
    );
};

export default LangSwitcher;
