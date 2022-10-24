import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Generated } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BotStatus, IBot, IUser, IBotCollection, IBotSystem } from 'runbotics-common';
import { BotCollectionEntity } from '../bot-collection/bot-collection.entity';
import { BotSystemEntity } from '../bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '../database.utils';

@Entity({ name: 'bot' })
export class BotEntity implements IBot {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
        id: number;

    @Column({ transformer: dateTransformer })
        created: string;

    @Column({ name: 'installation_id', unique: true })
        installationId: string;

    @Column({ name: 'last_connected', transformer: dateTransformer })
        lastConnected: string;

    @Column()
        status: BotStatus;

    @Column()
        version: string;

    @ManyToOne(() => BotSystemEntity)
    @JoinColumn([{ name: 'system', referencedColumnName: 'name' }])
        system: IBotSystem;

    @ManyToOne(() => UserEntity)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
        user: IUser;

    @ManyToOne(() => BotCollectionEntity)
    @JoinColumn([{ name: 'collection_id', referencedColumnName: 'id' }])
        collection: IBotCollection;

}
