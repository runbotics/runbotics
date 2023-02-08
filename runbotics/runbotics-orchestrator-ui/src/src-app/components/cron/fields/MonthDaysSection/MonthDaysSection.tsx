import { FC } from 'react';

import PeriodDefinition from '../../components/PeriodDefinition';
import { MonthDaysSectionProps } from './MonthDaysSection.types';
import MonthDaysSelect from './MonthDaysSelect';
import NthMonthDaysSelect from './NthMonthDaysSelect';

import If from '#src-app/components/utils/If';

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
    
    return (
        <If condition={!readOnly}>
            <If condition={locale.prefixMonthDays !== ''}>
                <PeriodDefinition 
                    localeKey='prefixMonthDays'
                    locale={locale} 
                />
            </If>
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
        </If>
    );
};

export default MonthDaysSection;

