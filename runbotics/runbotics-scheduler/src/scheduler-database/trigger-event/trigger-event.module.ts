import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TriggerEvent } from './trigger-event.entity';
import { TriggerEventService } from './trigger-event.service';

@Module({
    imports: [TypeOrmModule.forFeature([TriggerEvent])],
    exports: [TriggerEventService],
    providers: [TriggerEventService],
})
export class TriggerEventModule {}
