import { ProcessEntity } from '#/database/process/process.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from '../credential/credential.entity';


@Entity({ schema: 'scheduler', name: 'process_credential' })
export class ProcessCredential {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    order: number;

    @ManyToOne(() => ProcessEntity, { nullable: false })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @ManyToOne(() => Credential, { nullable: false })
    @JoinColumn({ name: 'credential_id' })
    credential: Credential;
}