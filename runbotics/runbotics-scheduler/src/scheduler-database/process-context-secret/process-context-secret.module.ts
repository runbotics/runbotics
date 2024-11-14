import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessContextSecretModule])],
})
export class ProcessContextSecretModule {}
