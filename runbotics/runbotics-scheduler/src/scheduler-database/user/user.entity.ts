import { dateTransformer, numberTransformer } from '#/database/database.utils';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Authority } from '../authority/authority.entity';
import { IAuthority, Role } from 'runbotics-common';
import { Tenant } from '../tenant/tenant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'jhi_user' })
@Unique(['microsoftTenantId', 'microsoftUserId'])
export class User {
    @ApiProperty({ example: 1, description: 'Unique user ID (primary key).' })
    @PrimaryColumn({
        type: 'bigint',
        transformer: numberTransformer,
        default: () => 'nextval(\'sequence_generator\')',
    })
    id: number;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'User email address (must be unique).',
    })
    @Column({ type: 'varchar', length: 191, unique: true })
    email: string;

    @Column({
        name: 'password_hash',
        type: 'varchar',
        select: false,
        length: 60,
    })
    passwordHash: string;

    @ApiProperty({
        example: 'John',
        description: 'User’s first name.',
        required: false,
    })
    @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'User’s last name.',
        required: false,
    })
    @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: true })
    lastName: string;

    @ApiProperty({
        example: 'https://example.com/profile.png',
        description: 'URL to the user’s profile image.',
        required: false,
    })
    @Column({ name: 'image_url', type: 'varchar', length: 256, nullable: true })
    imageUrl: string;

    @ApiProperty({
        example: 'en',
        description: 'User language preference (ISO code).',
    })
    @Column({ name: 'lang_key', type: 'varchar', length: 10, default: 'en' })
    langKey: string;

    @ApiProperty({
        type: 'string',
        format: 'uuid',
        description: 'Associated tenant ID.',
    })
    @Column({
        name: 'tenant_id',
        type: 'uuid',
        default: 'b7f9092f-5973-c781-08db-4d6e48f78e98',
    })
    tenantId: string;

    @ApiProperty({
        type: () => Tenant,
        description: 'Tenant the user belongs to.',
    })
    
    @Column({ name: 'microsoft_tenant_id', type: 'varchar', length: 256, nullable: true })
    microsoftTenantId: string;

    @Column({ name: 'microsoft_user_id', type: 'varchar', length: 256, nullable: true })
    microsoftUserId: string;

    @ManyToOne(() => Tenant, { eager: true })
    @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
    tenant: Tenant;

    @ApiProperty({
        example: true,
        description: 'Indicates whether the user is activated.',
    })
    @Column({ type: 'boolean' })
    activated: boolean;

    @ApiProperty({
        example: false,
        description:
            'Indicates whether the user has ever activated their account.',
    })
    @Column({
        name: 'has_been_activated',
        type: 'boolean',
        default: false,
    })
    hasBeenActivated: boolean;

    @Column({
        name: 'activation_key',
        type: 'varchar',
        select: false,
        length: 20,
        nullable: true,
    })
    activationKey: string;

    @Column({
        name: 'reset_key',
        type: 'varchar',
        select: false,
        length: 20,
        nullable: true,
    })
    resetKey: string;

    @ApiProperty({
        example: 'admin',
        description: 'Username of the user who created this record.',
    })
    @Column({ name: 'created_by', type: 'varchar', length: 50 })
    createdBy: string;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        description: 'Timestamp of the last password reset.',
        required: false,
    })
    @Column({
        name: 'reset_date',
        type: 'timestamp',
        transformer: dateTransformer,
        nullable: true,
    })
    resetDate: string;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        description: 'Timestamp when the user was created.',
    })
    @CreateDateColumn({
        name: 'created_date',
        type: 'timestamp',
        transformer: dateTransformer,
    })
    createdDate: string;

    @ApiProperty({
        type: 'string',
        format: 'date-time',
        description: 'Timestamp of the last modification.',
    })
    @UpdateDateColumn({
        name: 'last_modified_date',
        type: 'timestamp',
        transformer: dateTransformer,
    })
    lastModifiedDate: string;

    @ApiProperty({
        example: 'admin',
        description: 'Username of the last person who modified the user.',
    })
    @Column({ name: 'last_modified_by', type: 'varchar', length: 50 })
    lastModifiedBy: string;

    @ApiProperty({
        type: [Authority],
        description: 'List of granted authorities (roles) for the user.',
        example: Role.ROLE_ADMIN,
    })
    @ManyToMany(() => Authority, {
        eager: true,
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'jhi_user_authority',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'authority_name',
            referencedColumnName: 'name',
        },
    })
    authorities: IAuthority[];
}
