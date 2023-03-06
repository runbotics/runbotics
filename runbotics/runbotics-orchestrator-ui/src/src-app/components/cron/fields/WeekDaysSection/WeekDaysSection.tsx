import { FC } from 'react';

import If from '#src-app/components/utils/If';

import PeriodDefinition from '../../components/PeriodDefinition';
import { PeriodType } from '../../types';
import NthWeekDaysSelect from './NthWeekDaysSelect';
import { WeekDaysSectionProps } from './WeekDaysSection.types';
import WeekDaysSelect from './WeekDaysSelect';

// eslint-disable-next-line complexity
const WeekDaysSection: FC<WeekDaysSectionProps> = ({ 
    locale,
    humanizeLabels,
    disabled,
    readOnly,
    periodForRender,
    isMonthPeriodDisplayed,
    weekDays,
    setWeekDays,
    nthWeekDays,
    setNthWeekDays,
}) => (
    <>
        <If condition={!isMonthPeriodDisplayed}>
            <PeriodDefinition 
                localeKey='prefixWeekDays'
                locale={locale} 
            />
        </If>
        <If condition={periodForRender !== PeriodType.WEEK && isMonthPeriodDisplayed}>
            <PeriodDefinition 
                localeKey='prefixWeekDaysForMonthAndYearPeriod'
                locale={locale} 
            />
            <NthWeekDaysSelect
                value={nthWeekDays}
                setValue={setNthWeekDays}
                locale={locale}
                humanizeLabels={humanizeLabels}
                disabled={disabled}
                readOnly={readOnly}
                period={periodForRender}
                isOneWeekDaySelected={weekDays?.length === 1}
                isMonthPeriodDisplayed={isMonthPeriodDisplayed}
            />
        </If>
        <WeekDaysSelect
            value={weekDays}
            setValue={setWeekDays}
            locale={locale}
            humanizeLabels={humanizeLabels}
            disabled={disabled}
            readOnly={readOnly}
            period={periodForRender}
        />
        <If condition={nthWeekDays?.length > 0}>
            <PeriodDefinition 
                localeKey='suffixWeekDays'
                locale={locale} 
            />
        </If>
    </>
);


export default WeekDaysSection;
