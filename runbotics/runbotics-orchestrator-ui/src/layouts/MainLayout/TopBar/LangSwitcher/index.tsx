import useTranslations from 'src/hooks/useTranslations';
import React, { ChangeEvent, useState } from 'react';
import {
    Select, SvgIcon, InputLabel,
} from '@mui/material';
import {
    languages, TranslationsDescriptors, DEFAULT_LANG, Language,
} from 'src/translations/translations';
import LanguageIcon from '@mui/icons-material/Language';
import { LangFormControl, StyledMenuItem } from './LangSwitcher.styled';
import { useSelector } from 'src/store';
import LanguageChangeDialog from './LanguageChangeDialog';

const LangSwitcher = () => {
    const [selectedLang, setSelectedLang] = useState<Language>(DEFAULT_LANG);
    const { translate, switchLanguage } = useTranslations();
    const { isSaveDisabled } = useSelector((state) => state.process.modeler);
    const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANG);

    const onSwitchLang = (e: ChangeEvent<HTMLInputElement>) => {
        const lang = e.target.value as Language;
        
        if (!isSaveDisabled) {
            setIsDialogOpen(true);
            setCurrentLanguage(lang);
        } else {
            setSelectedLang(lang);
            switchLanguage(lang);
        }
    };
    
    const onConfirm = () => {
        setIsDialogOpen(false);
        setSelectedLang(currentLanguage);
        switchLanguage(currentLanguage);
    };

    const onCancel = () => {
        setIsDialogOpen(false);
    };

    return (
        <LangFormControl size="small" variant="standard">
            <LanguageChangeDialog onConfirm={onConfirm} onCancel={onCancel} isDialogOpen={isDialogOpen} />
            <InputLabel>
                <SvgIcon>
                    <LanguageIcon />
                </SvgIcon>
                <Select value={selectedLang} onChange={onSwitchLang}>
                    {languages.map((lang) => (
                        <StyledMenuItem value={lang} key={lang}>
                            {translate(`Common.Languages.${lang}` as keyof TranslationsDescriptors)}
                        </StyledMenuItem>
                    ))}
                </Select>
            </InputLabel>
        </LangFormControl>
    );
};

export default LangSwitcher;
