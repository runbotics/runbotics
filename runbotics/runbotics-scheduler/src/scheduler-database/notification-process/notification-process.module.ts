import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationProcess } from './notification-process.entity';


@Module({
    imports: [TypeOrmModule.forFeature([NotificationProcess])],
    providers: [],
    exports: []
})
export class NotificationProcessModule {}
