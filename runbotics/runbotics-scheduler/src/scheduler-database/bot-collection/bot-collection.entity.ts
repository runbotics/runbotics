import {
    Column, CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { IBotCollection } from 'runbotics-common';
import { UserEntity } from '#/database/user/user.entity';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';

@Entity({ name: 'bot_collection' })
export class BotCollection implements IBotCollection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, type: 'varchar', length: 255,  })
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
        default: 'b7f9092f-5973-c781-08db-4d6e48f78e98',
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
