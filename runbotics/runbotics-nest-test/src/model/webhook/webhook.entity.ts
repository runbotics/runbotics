import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Webhook {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({name: 'rb_url'})
  rbUrl: string;
  
  @Column({name: 'rb_webhook_id', default: '1'})
  webhookId: string;
  
  @Column()
  resources: string;
  
  @Column()
  authorization: string;
}
