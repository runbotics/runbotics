import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GlobalVariable } from './global-variable.entity';
import { GlobalVariableService } from './global-variable.service';
import { GlobalVariableController } from './global-variable.controller';


@Module({
    imports: [TypeOrmModule.forFeature([GlobalVariable])],
    providers: [GlobalVariableService],
    controllers: [GlobalVariableController],
    exports: [GlobalVariableService],
})
export class GlobalVariableModule {}
