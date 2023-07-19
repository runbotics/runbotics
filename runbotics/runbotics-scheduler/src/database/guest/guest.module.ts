import { Module } from '@nestjs/common';
import { GuestEntity } from './guest.entity';
import { GuestService } from './guest.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([GuestEntity])],
    exports: [GuestService],
    providers: [GuestService]
})
export class GuestModule {}
