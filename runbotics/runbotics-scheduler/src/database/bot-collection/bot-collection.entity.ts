import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IBot, IBotCollection, IUser } from 'runbotics-common';
import { UserEntity } from '../user/user.entity';
import { BotEntity } from '../bot/bot.entity';
import { dateTransformer } from '../database.utils';

@Entity({ name: 'bot_collection', synchronize: false })
export class BotCollectionEntity implements IBotCollection {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column({ unique: true, type: 'varchar' })
        name: string;

    @Column({ type: 'varchar' })
        description: string;

    @Column({ name: 'public_bots_included', type: 'boolean' })
        publicBotsIncluded: boolean;

    @Column({ transformer: dateTransformer, type: 'varchar' })
        created: string;

    @Column({ transformer: dateTransformer, type: 'varchar' })
        updated: string;

    @Column({ name: 'tenant_id', type: 'uuid' })
        tenantId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn([{ name: 'created_by', referencedColumnName: 'id' }])
        createdByUser: IUser;

    @OneToMany(() => BotEntity, bot => bot.collection)
        bots: IBot[];

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'bot_collection_user',
        joinColumn: { name: 'bot_collection_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
        users: IUser[];

}
