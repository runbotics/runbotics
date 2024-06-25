import { Module } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { AttributeController } from './attribute.controller';
import { Attribute } from './attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '../secret/secret.entity';
import { SecretService } from '../secret/secret.service';
import { SecretModule } from '../secret/secret.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute]), TypeOrmModule.forFeature([Secret]), SecretModule],
  controllers: [AttributeController],
  providers: [AttributeService, SecretService],
  exports: [AttributeService],
})
export class AttributeModule {}