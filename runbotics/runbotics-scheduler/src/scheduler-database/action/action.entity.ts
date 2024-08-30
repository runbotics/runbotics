import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity({ name: 'action' })
export class Action {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    label: string;

    @Column({ type: 'text' })
    form: string;

    @Column({ type: 'varchar', length: 255 })
    script: string;
}
