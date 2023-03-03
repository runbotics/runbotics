import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalVariableEntity } from './global-variable.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GlobalVariableEntity])]
})
export class GlobalVariableModule {}