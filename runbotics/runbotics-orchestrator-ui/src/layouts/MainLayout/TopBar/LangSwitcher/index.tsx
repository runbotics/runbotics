import React, { ChangeEvent, useState } from 'react';
import {
    Select, SvgIcon, InputLabel,
} from '@mui/material';
import {
    languages, TranslationsDescriptors, DEFAULT_LANG, Language,
} from 'src/translations/translations';
import LanguageIcon from '@mui/icons-material/Language';
import useTranslations from 'src/hooks/useTranslations';
import { LangFormControl, StyledMenuItem } from './LangSwitcher.styled';

const LangSwitcher = () => {
    const [selectedLang, setSelectedLang] = useState<Language>(DEFAULT_LANG);
    const { translate, switchLanguage } = useTranslations();

    const onSwitchLang = (e: ChangeEvent<HTMLInputElement>) => {
        const lang = e.target.value as Language;
        setSelectedLang(lang);
        switchLanguage(lang);
    };

    return (
        <LangFormControl size="small" variant="standard">
            <InputLabel>
                <SvgIcon>
                    <LanguageIcon />
                </SvgIcon>
                <Select
                    value={selectedLang}
                    onChange={onSwitchLang}
                >
                    {
                        languages.map((lang) => (
                            <StyledMenuItem
                                value={lang}
                                key={lang}
                            >
                                {translate(`Common.Languages.${lang}` as keyof TranslationsDescriptors)}
                            </StyledMenuItem>
                        ))
                    }
                </Select>
            </InputLabel>
        </LangFormControl>
    );
};

export default LangSwitcher;
