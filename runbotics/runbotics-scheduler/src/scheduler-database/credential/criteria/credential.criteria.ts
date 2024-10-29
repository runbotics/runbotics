import { NumberFilter } from '#/utils/specification/filter/number-filter/number.filter';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';

import { DatetimeFilter } from '#/utils/specification/filter/datetime-filter/datetime-filter';
import { Criteria } from '#/utils/specification/criteria/criteria';
import { UUIDFilter } from '#/utils/specification/filter/uuid-filter/uuid.filter';

export class CredentialCriteria extends Criteria {
    id = new NumberFilter();
    name = new StringFilter();
    created = new DatetimeFilter();
    updated = new DatetimeFilter();
    collectionId: UUIDFilter = new UUIDFilter();
    collection: CollectionCriteria = new CollectionCriteria();
    createdBy = new CreatedByCriteria();
}

class CreatedByCriteria extends Criteria {
    id = new NumberFilter();
    email = new StringFilter();
}

class CollectionCriteria extends Criteria {
    name = new StringFilter();
}