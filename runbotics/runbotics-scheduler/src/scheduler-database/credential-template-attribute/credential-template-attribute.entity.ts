import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CredentialTemplate } from '../credential-template/credential-template.entity';
import { CredentialTemplateAttributeType } from 'runbotics-common';

@Entity({ schema: 'scheduler' })
export class CredentialTemplateAttribute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'required' })
    required: boolean;

    @Column({ name: 'type' })
    type: CredentialTemplateAttributeType;

    @ManyToOne(() => CredentialTemplate, credentialTemplate => credentialTemplate.attributes)
    @JoinColumn({ name: 'template_id' })
    template: CredentialTemplate;

    @Column({ name: 'template_id' })
    templateId: string;
}
