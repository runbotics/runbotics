import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CredentialTemplate } from '../credential-template/credential-template.entity';

@Entity({ schema: 'scheduler' })
@Unique(['name', 'templateId'])
export class CredentialTemplateAttribute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @ManyToOne(() => CredentialTemplate, credentialTemplate => credentialTemplate.attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'template_id' })
    template: CredentialTemplate;

    @Column({ name: 'template_id' })
    templateId: string;
}
