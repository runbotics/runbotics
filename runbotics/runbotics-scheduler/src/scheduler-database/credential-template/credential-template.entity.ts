import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CredentialTemplateAttribute } from '../credential-template-attribute/credential-template-attribute.entity';
import { Credential } from '../credential/credential.entity';

@Entity({ schema: 'scheduler' })
export class CredentialTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @OneToMany(() => CredentialTemplateAttribute, attribute => attribute.template, { cascade: true })
    attributes: CredentialTemplateAttribute[];

    @OneToMany(() => Credential, credential => credential.template)
    credentials: Credential[];
}
