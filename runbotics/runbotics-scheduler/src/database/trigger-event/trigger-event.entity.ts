import { ITriggerEvent, TriggerEvent } from 'runbotics-common';
import { PrimaryColumn, Entity } from 'typeorm';

@Entity({ name: 'trigger_event', synchronize: false })
export class TriggerEventEntity implements ITriggerEvent {

    @PrimaryColumn({ type: 'varchar' })
        name: TriggerEvent;
}
