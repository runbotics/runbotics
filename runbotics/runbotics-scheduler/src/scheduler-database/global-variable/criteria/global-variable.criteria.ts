import { Criteria } from "#/utils/specification/criteria/criteria";
import { StringFilter } from "#/utils/specification/filter/string-filter/string.filter";



export class GlobalVariableCriteria extends Criteria {
    name = new StringFilter();
    description = new StringFilter();
    type = new StringFilter();
    lastModified = new StringFilter();
    creator = {
        email: new StringFilter(),
    };
    user = {
        email: new StringFilter(),
    };
}