import { Logger } from '#/utils/logger';
import { Injectable } from '@nestjs/common';
import mailEn from './i18n/en/mail.json';
import mailPl from './i18n/pl/mail.json';
import { DEFAULT_LANGUAGE, Language, SupportedLanguage } from 'runbotics-common';

interface TranslationObject {
    [key: string]: string | TranslationObject;
}

@Injectable()
export class I18nService {
    private logger = new Logger(I18nService.name);
    private translations: Record<SupportedLanguage, TranslationObject>;

    constructor() {
        try {
            this.translations = {
                [Language.EN]: mailEn as TranslationObject,
                [Language.PL]: mailPl as TranslationObject,
            };
            this.logger.log(`I18n loaded, langs: ${Object.keys(this.translations).join(', ')}`);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            this.logger.error(`I18n initialization failed: ${errorMessage}`);
        }
    }

    translate(key: string, lang?: SupportedLanguage, vars: Record<string, string> = {}): string {
        const fallbackLang: SupportedLanguage = DEFAULT_LANGUAGE;
        
        const effectiveLang: SupportedLanguage = (lang && this.translations[lang]) ? lang : fallbackLang;

        const value = this.getTranslation(this.translations[effectiveLang], key) ??
            this.getTranslation(this.translations[fallbackLang], key) ??
            key;

        return this.interpolateVars(value, vars);
    }

    private getTranslation(obj: TranslationObject, path: string): string | undefined {
        const parts = path.split('.');
        let current: string | TranslationObject | undefined = obj;

        for (const part of parts) {
            if (current == null) return undefined;

            if (typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, part)) {
                return undefined;
            }

            current = (current as TranslationObject)[part];
        }

        return typeof current === 'string' ? current : undefined;
    }

    private interpolateVars(text: string, vars: Record<string, string>): string {
        return text.replace(/{{(.*?)}}/g, (_, varName) => vars[varName.trim()] ?? '');
    }
}
