import { TriggerEvent as TriggerEvenName } from 'runbotics-common';
import { PrimaryColumn, Entity } from 'typeorm';

@Entity({ name: 'trigger_event' })
export class TriggerEvent {
    @PrimaryColumn({ type: 'character varying', length: 50 })
    name: TriggerEvenName;
}
