import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './action.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Action])],
    providers: [],
    controllers: [],
    exports: []
})
export class ActionModule {}
