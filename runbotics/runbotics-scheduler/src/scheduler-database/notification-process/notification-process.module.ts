import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationProcess } from './notification-process.entity';
import { NotificationProcessController } from './notification-process.controller';
import { NotificationProcessService } from './notification-process.service';
import { ProcessEntity } from '#/database/process/process.entity';


@Module({
    imports: [TypeOrmModule.forFeature([NotificationProcess, ProcessEntity])],
    providers: [NotificationProcessService],
    controllers: [NotificationProcessController],
    exports: [NotificationProcessService]
})
export class NotificationProcessModule {}
