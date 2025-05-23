import { Criteria } from '#/utils/specification/criteria/criteria';
import { DatetimeFilter } from '#/utils/specification/filter/datetime-filter/datetime-filter';
import { NumberFilter } from '#/utils/specification/filter/number-filter/number.filter';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';

export class ProcessInstanceEventCriteria extends Criteria {
    id = new NumberFilter();
    created = new DatetimeFilter();
    step = new StringFilter();
    processInstanceId = new StringFilter();
    executionId = new StringFilter();
    finished = new DatetimeFilter();
}
