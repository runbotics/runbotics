import { PrimaryColumn, Entity } from 'typeorm';
import { BotSystem, IBotSystem } from 'runbotics-common';

@Entity({ name: 'bot_system', synchronize: false })
export class BotSystemEntity implements IBotSystem {

    @PrimaryColumn({ type: 'varchar' })
        name: BotSystem;
}
