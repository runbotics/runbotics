import { Criteria } from '#/utils/specification/criteria/criteria';
import { BooleanFilter } from '#/utils/specification/filter/boolean-filter/boolean.filter';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';
import { UUIDFilter } from '#/utils/specification/filter/uuid-filter/uuid.filter';


export class UserCriteria extends Criteria {
    email = new StringFilter();
    activated = new BooleanFilter();
    tenantId = new UUIDFilter();
}
