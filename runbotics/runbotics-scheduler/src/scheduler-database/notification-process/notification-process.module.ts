import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationProcess } from './notification-process.entity';
import { NotificationProcessController } from './notification-process.controller';
import { NotificationProcessService } from './notification-process.service';
import { ProcessModule } from '#/scheduler-database/process/process.module';


@Module({
    imports: [TypeOrmModule.forFeature([NotificationProcess]), ProcessModule],
    providers: [NotificationProcessService],
    controllers: [NotificationProcessController],
    exports: [NotificationProcessService]
})
export class NotificationProcessModule {}
