import { FC } from 'react';

import { PeriodText } from '../../Cron.styles';
import DEFAULT_LOCALE_EN from '../../locale';
import { PeriodDefinitionProps } from './PeriodDefinition.types';

const PeriodDefinition: FC<PeriodDefinitionProps>= ({
    locale = DEFAULT_LOCALE_EN,
    localeKey,
}) => (
    <PeriodText>
        {locale[localeKey] || DEFAULT_LOCALE_EN[localeKey]}
    </PeriodText>
);

export default PeriodDefinition;
