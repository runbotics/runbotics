import { Criteria } from '#/utils/specification/criteria/criteria';
import { StringFilter } from '#/utils/specification/filter/string-filter/string.filter';


export class TenantCriteria extends Criteria {
    name = new StringFilter();
}