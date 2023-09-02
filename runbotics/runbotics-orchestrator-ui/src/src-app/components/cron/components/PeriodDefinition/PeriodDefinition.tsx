import { FC } from 'react';

import { PeriodText } from './PeriodDefinition.styles';
import { PeriodDefinitionProps } from './PeriodDefinition.types';
import DEFAULT_LOCALE_EN from '../../locale';

const PeriodDefinition: FC<PeriodDefinitionProps>= ({
    locale = DEFAULT_LOCALE_EN,
    localeKey,
}) => (
    <PeriodText>
        {locale[localeKey] || DEFAULT_LOCALE_EN[localeKey]}
    </PeriodText>
);

export default PeriodDefinition;
