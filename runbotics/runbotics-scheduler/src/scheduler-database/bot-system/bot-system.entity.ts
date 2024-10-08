import { PrimaryColumn, Entity, OneToMany } from 'typeorm';
import { BotSystemType, IBotSystem } from 'runbotics-common';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';

@Entity({ name: 'bot_system' })
export class BotSystemEntity implements IBotSystem {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    name: BotSystemType;

    @OneToMany(() => ProcessEntity, process => process.system)
    processes: ProcessEntity[];
}
