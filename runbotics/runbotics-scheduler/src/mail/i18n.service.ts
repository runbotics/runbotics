import { Logger } from '#/utils/logger';
import { Injectable } from '@nestjs/common';
import mailEn from './i18n/en/mail.json';
import mailPl from './i18n/pl/mail.json';

interface TranslationObject {
    [key: string]: string | TranslationObject;
}

type SupportedLanguage = 'en' | 'pl';

@Injectable()
export class I18nService {
    private logger = new Logger(I18nService.name);
    private translations: Record<SupportedLanguage, TranslationObject>;

    constructor() {
        try {
            this.translations = {
                en: mailEn as TranslationObject,
                pl: mailPl as TranslationObject,
            };
            this.logger.log(`I18n loaded, langs: ${Object.keys(this.translations).join(', ')}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            this.logger.error(`I18n initialization failed: ${errorMessage}`);
        }
    }

    translate(key: string, lang = 'en', vars: Record<string, string> = {}): string {
        const fallbackLang: SupportedLanguage = 'en';
        
        const isValidLang = (lang: string): lang is SupportedLanguage => {
            return lang === 'en' || lang === 'pl';
        };

        const effectiveLang: SupportedLanguage = (lang && isValidLang(lang) && this.translations[lang]) 
            ? lang 
            : fallbackLang;

        const value = this.getNestedValue(this.translations[effectiveLang], key) ??
            this.getNestedValue(this.translations[fallbackLang], key) ??
            key;

        return this.interpolate(value, vars);
    }

    private getNestedValue(obj: TranslationObject, path: string): string | undefined {
        const parts = path.split('.');
        let current: string | TranslationObject | undefined = obj;
        
        for (const part of parts) {
            if (typeof current === 'object' && current !== null && part in current) {
                current = current[part];
            } else {
                return undefined;
            }
        }
        
        return typeof current === 'string' ? current : undefined;
    }

    private interpolate(text: string, vars: Record<string, string>): string {
        if(typeof text !== 'string') return text;
        return text.replace(/{{(.*?)}}/g, (_, varName) => vars[varName.trim()] ?? '');
    }
}
