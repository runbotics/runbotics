// classes extending Criteria should only contain Filter fields
export abstract class Criteria {
    _type = 'criteria' as const;
}
