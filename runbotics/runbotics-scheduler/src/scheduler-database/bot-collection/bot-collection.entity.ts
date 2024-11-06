import {
    Column, CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { IBotCollection } from 'runbotics-common';
import { UserEntity } from '#/database/user/user.entity';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';
import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';

@Entity({ name: 'bot_collection' })
export class BotCollection implements IBotCollection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'public_bots_included', type: 'boolean', default: false })
    publicBotsIncluded: boolean;

    @CreateDateColumn({ type: 'timestamp without time zone', nullable: true })
    created: string;

    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
    updated: string;

    @Column({
        name: 'tenant_id',
        type: 'uuid',
        nullable: false,
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    createdByUser: UserEntity;

    @OneToMany(() => BotEntity, bot => bot.collection)
    bots: BotEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'bot_collection_user',
        joinColumn: { name: 'bot_collection_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: UserEntity[];
}
