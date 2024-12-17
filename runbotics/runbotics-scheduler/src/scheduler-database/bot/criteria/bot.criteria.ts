import { Criteria } from '#/utils/specification/criteria/criteria';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';

export class BotCriteria extends Criteria {
    name = new StringFilter();
    description = new StringFilter();
    collection = new CollectionCriteria();
}

class CollectionCriteria extends Criteria {
    name = new StringFilter();
}
