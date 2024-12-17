import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from '../credential/credential.entity';


@Entity({ schema: 'scheduler', name: 'process_credential' })
export class ProcessCredential {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    order: number;

    @Column({ name: 'credential_id' })
    credentialId: string;

    @Column({ name: 'process_id' })
    processId: number;

    @ManyToOne(
        () => ProcessEntity,
        { nullable: false, onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @ManyToOne(
        () => Credential,
        { nullable: false, onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'credential_id' })
    credential: Credential;
}
