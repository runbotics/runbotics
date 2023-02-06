import { FC } from 'react';

import { PeriodText } from '../../Cron.styles';
import DEFAULT_LOCALE_EN from '../../locale';
import { Locale } from '../../types';

interface PeriodDefinitionProps {
    isDisplayed: boolean;
    locale: Locale;
    localeKey: string;
}

const PeriodDefinition: FC<PeriodDefinitionProps>= ({
    isDisplayed,
    locale = DEFAULT_LOCALE_EN,
    localeKey,
}) => isDisplayed 
    ? (
        <PeriodText>
            {locale[localeKey] || DEFAULT_LOCALE_EN[localeKey]}
        </PeriodText>
    ): null;

export default PeriodDefinition;
