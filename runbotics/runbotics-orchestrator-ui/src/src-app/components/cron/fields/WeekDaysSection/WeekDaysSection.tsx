import { FC } from 'react';

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
    isWeekPeriodDisplayed,
    weekDays,
    setWeekDays,
    nthWeekDays,
    setNthWeekDays,
}) => (
    <>
        <PeriodDefinition 
            isDisplayed={isWeekPeriodDisplayed && !isMonthPeriodDisplayed} 
            localeKey='prefixWeekDays'
            locale={locale} 
        />
        <PeriodDefinition 
            isDisplayed={periodForRender !== PeriodType.WEEK && isMonthPeriodDisplayed} 
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
            isAnyWeekDaySelected={weekDays?.length > 0}
            isMonthPeriodDisplayed={isMonthPeriodDisplayed}
        />
        <WeekDaysSelect
            value={weekDays}
            setValue={setWeekDays}
            locale={locale}
            humanizeLabels={humanizeLabels}
            disabled={disabled}
            readOnly={readOnly}
            period={periodForRender}
            isWeekPeriodDisplayed={isWeekPeriodDisplayed}
        />
        <PeriodDefinition 
            isDisplayed={nthWeekDays?.length > 0} 
            localeKey='suffixWeekDays'
            locale={locale} 
        />
    </>
);


export default WeekDaysSection;
