import { PrimaryColumn, Entity, OneToMany } from 'typeorm';
import { BotSystem, IBotSystem } from 'runbotics-common';
import { ProcessEntity } from '#/database/process/process.entity';

@Entity({ name: 'bot_system' })
export class BotSystemEntity implements IBotSystem {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    name: BotSystem;

    @OneToMany(() => ProcessEntity, process => process.system)
    processes: ProcessEntity[];
}
