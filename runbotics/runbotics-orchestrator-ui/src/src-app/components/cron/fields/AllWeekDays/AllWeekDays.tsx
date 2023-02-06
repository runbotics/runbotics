import { FC } from 'react';

import { PeriodTypes, Locale} from '../../types';
import PeriodDefinition from '../Components/PeriodDefinition';
import NthWeekDays from './NthWeekDays';
import WeekDays from './WeekDays';

interface AllWeekDaysProps {
    locale: Locale;
    humanizeLabels: boolean;
    disabled: boolean;
    readOnly: boolean;
    periodForRender: PeriodTypes;
    weekDays: number[];
    setWeekDays: (weekDays: number[]) => void;
    nthWeekDays: number[];
    setNthWeekDays: (nthWeekDays: number[]) => void;
    isMonthPeriodDisplayed: boolean;
    isWeekPeriodDisplayed: boolean;
}

// eslint-disable-next-line complexity
const AllWeekDays: FC<AllWeekDaysProps>= ({ 
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
            isDisplayed={periodForRender !== PeriodTypes.WEEK && isMonthPeriodDisplayed} 
            localeKey='prefixWeekDaysForMonthAndYearPeriod'
            locale={locale} 
        />
        <NthWeekDays
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
        <WeekDays
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


export default AllWeekDays;
