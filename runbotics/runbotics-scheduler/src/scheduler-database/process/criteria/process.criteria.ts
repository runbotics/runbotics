import { NumberFilter } from '#/utils/specification/filter/number-filter/number.filter';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';
import { BooleanFilter } from '#/utils/specification/filter/boolean-filter/boolean.filter';
import { DatetimeFilter } from '#/utils/specification/filter/datetime-filter/datetime-filter';
import { Criteria } from '#/utils/specification/criteria/criteria';

export class ProcessCriteria extends Criteria {
    id = new NumberFilter();
    name = new StringFilter();
    isPublic = new BooleanFilter();
    created = new DatetimeFilter();
    updated = new DatetimeFilter();
    botCollection = new BotCollectionCriteria();
    tags = new TagCriteria();
    processCollectionId = new StringFilter();
    createdBy = new CreatedByCriteria();
}

class CreatedByCriteria extends Criteria {
    id = new NumberFilter();
    login = new StringFilter();
}

class TagCriteria extends Criteria {
    name = new StringFilter();
}

class BotCollectionCriteria extends Criteria {
    name = new StringFilter();
}
