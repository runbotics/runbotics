import { NumberFilter } from '#/utils/specification/filter/number-filter/number.filter';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';
import { BooleanFilter } from '#/utils/specification/filter/boolean-filter/boolean.filter';
import { DatetimeFilter } from '#/utils/specification/filter/datetime-filter/datetime-filter';
import { Criteria } from '#/utils/specification/criteria/criteria';

export class ProcessCriteria implements Criteria<ProcessCriteria> {
    id = new NumberFilter();
    name = new StringFilter();
    isPublic = new BooleanFilter();
    created = new DatetimeFilter();
    updated = new DatetimeFilter();
    createdById = new NumberFilter();
    createdByName = new StringFilter();
    botCollectionName = new StringFilter();
    tagName = new StringFilter();
    collectionId = new StringFilter();
}
