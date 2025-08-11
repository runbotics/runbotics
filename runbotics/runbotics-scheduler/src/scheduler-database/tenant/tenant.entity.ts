import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Secret } from '../secret/secret.entity';
import { ProcessContextSecret } from '../process-context-secret/process-context-secret.entity';
import { ProcessContext } from '../process-context/process-context.entity';
import { CredentialAttribute } from '../credential-attribute/credential-attribute.entity';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';
import { Credential } from '../credential/credential.entity';
import { User } from '../user/user.entity';
import { EmailTriggerWhitelistItem } from '../email-trigger-whitelist-item/email-trigger-whitelist-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Tenant {
    @ApiProperty({ type: 'string', format: 'uuid' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: 'string', maxLength: 255, example: 'acme-corp' })
    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdByUser: User;

    @ApiProperty({ type: 'number', example: 42 })
    @Column({ name: 'created_by' })
    createdBy: number;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @CreateDateColumn()
    created: Date;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @UpdateDateColumn()
    updated: Date;

    @ApiProperty({ type: 'string', maxLength: 50, nullable: true, example: 'john.doe' })
    @Column({ type: 'varchar', name: 'last_modified_by', length: 50, nullable: true })
    lastModifiedBy: string;

    @ApiProperty({ type: () => [Secret] })
    @OneToMany(() => Secret, secret => secret.tenant)
    secrets: Secret[];

    @ApiProperty({ type: () => [ProcessContextSecret] })
    @OneToMany(() => ProcessContextSecret, secret => secret.tenant)
    processContextSecrets: ProcessContextSecret[];

    @ApiProperty({ type: () => [ProcessContext] })
    @OneToMany(() => ProcessContext, processContext => processContext.tenant)
    processContexts: ProcessContext[];

    @ApiProperty({ type: () => [CredentialAttribute] })
    @OneToMany(() => CredentialAttribute, attribute => attribute.tenant)
    attributes: CredentialAttribute[];

    @ApiProperty({ type: () => [Credential] })
    @OneToMany(() => Credential, credential => credential.tenant)
    credentials: Credential[];

    @ApiProperty({ type: () => [CredentialCollection] })
    @OneToMany(() => CredentialCollection, credentialCollection => credentialCollection.tenant)
    credentialCollections: CredentialCollection[];

    @ApiProperty({ type: () => [EmailTriggerWhitelistItem] })
    @OneToMany(
        () => EmailTriggerWhitelistItem,
        emailTriggerWhitelistItem => emailTriggerWhitelistItem.tenant,
        { cascade: true },
    )
    emailTriggerWhitelist: EmailTriggerWhitelistItem[];
}
