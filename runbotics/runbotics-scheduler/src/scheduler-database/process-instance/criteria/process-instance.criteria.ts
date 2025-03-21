import { Criteria } from '#/utils/specification/criteria/criteria';
import { BooleanFilter } from '#/utils/specification/filter/boolean-filter/boolean.filter';
import { DatetimeFilter } from '#/utils/specification/filter/datetime-filter/datetime-filter';
import { ListFilter } from '#/utils/specification/filter/list-filter/list.filter';
import { NumberFilter } from '#/utils/specification/filter/number-filter/number.filter';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';

export class ProcessInstanceCriteria extends Criteria {
    id = new StringFilter();
    rootProcessInstanceId = new StringFilter();
    orchestratorProcessInstanceId = new StringFilter();
    created = new DatetimeFilter();
    updated = new DatetimeFilter();
    step = new StringFilter();
    processId = new NumberFilter();
    botId = new NumberFilter();
    scheduled = new BooleanFilter();
    processName = new StringFilter();
    botInstallationId = new StringFilter();
    status = new ListFilter();
    createdByName = new StringFilter();
}
