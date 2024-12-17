import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './guest.entity';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Guest])],
    controllers: [GuestController],
    exports: [GuestService],
    providers: [GuestService]
})
export class GuestModule {}
