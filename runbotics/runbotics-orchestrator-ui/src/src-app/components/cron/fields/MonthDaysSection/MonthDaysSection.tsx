import { FC } from 'react';

import PeriodDefinition from '../../components/PeriodDefinition';
import { MonthDaysSectionProps } from './MonthDaysSection.types';
import MonthDaysSelect from './MonthDaysSelect';
import NthMonthDaysSelect from './NthMonthDaysSelect';


// eslint-disable-next-line complexity
const MonthDaysSection: FC<MonthDaysSectionProps> = ({
    locale,
    className,
    disabled,
    readOnly,
    leadingZero,
    period,
    monthDays,
    setMonthDays,
    nthMonthDays,
    setNthMonthDays,
    humanizeLabels,
}) => {
    const isAnyMonthDaySelected = monthDays?.length > 0;
    const isAnyNthMonthDaySelected = nthMonthDays?.length > 0;
    
    return !readOnly ? (
        <>
            <PeriodDefinition 
                isDisplayed={locale.prefixMonthDays !== ''} 
                localeKey='prefixMonthDays'
                locale={locale} 
            />
            <NthMonthDaysSelect 
                value={nthMonthDays}
                setValue={setNthMonthDays}
                locale={locale}
                className={className}
                disabled={disabled || isAnyMonthDaySelected}
                readOnly={readOnly}
                period={period}
                humanizeLabels={humanizeLabels}
            />
            <MonthDaysSelect 
                value={monthDays}
                setValue={setMonthDays}
                locale={locale}
                className={className}
                disabled={disabled || isAnyNthMonthDaySelected}
                readOnly={readOnly}
                leadingZero={leadingZero}
                period={period}
                humanizeLabels={humanizeLabels}
            />
        </>
    ) : null;
};

export default MonthDaysSection;

