import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('unsubscribe_token')
export class UnsubscribeToken {
  @ApiProperty({ type: 'number', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: 'string', maxLength: 255, example: 'user@example.com' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @ApiProperty({ type: 'string', maxLength: 64, example: 'a3f7b1c9e7d4f2...' })
  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  token: string;
}
