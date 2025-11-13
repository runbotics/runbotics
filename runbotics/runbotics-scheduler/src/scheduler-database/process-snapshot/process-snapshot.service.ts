import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ProcessSnapshotEntity } from './process-snapshot.entity';
import { ProcessEntity } from '../process/process.entity';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { ProcessSnapshotResponseDto, ProcessSnapshotDetailResponseDto } from './dto/process-snapshot-response.dto';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage, Page } from '#/utils/page/page';
import { Logger } from '#/utils/logger';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

@Injectable()
export class ProcessSnapshotService {
    private readonly logger = new Logger(ProcessSnapshotService.name);

    constructor(
        @InjectRepository(ProcessSnapshotEntity)
        private readonly processSnapshotRepository: Repository<ProcessSnapshotEntity>,
        @InjectRepository(ProcessEntity)
        private readonly processRepository: Repository<ProcessEntity>,
    ) {}

    async createSnapshot(
        processId: number,
        userId: number,
        createSnapshotDto: CreateSnapshotDto,
    ): Promise<ProcessSnapshotResponseDto> {
        this.logger.log(`Creating snapshot for process ${processId} by user ${userId}`);

        const process = await this.processRepository.findOne({
            where: { id: processId },
            relations: ['createdBy'],
        });

        if (!process) {
            throw new NotFoundException(`Process with id ${processId} not found`);
        }

        if (!process.definition) {
            throw new BadRequestException('Process definition is empty, cannot create snapshot');
        }

        try {
            const versionNumber = await this.getNextVersionNumber(processId);

            const compressedDefinition = await gzipAsync(Buffer.from(process.definition, 'utf8'));

            const snapshot = this.processSnapshotRepository.create({
                processId,
                versionNumber,
                name: createSnapshotDto.name,
                description: createSnapshotDto.description,
                processDefinition: compressedDefinition,
                createdById: userId,
            });

            const savedSnapshot = await this.processSnapshotRepository.save(snapshot);

            const snapshotWithRelations = await this.processSnapshotRepository.findOne({
                where: { id: savedSnapshot.id },
                relations: ['process', 'createdBy'],
            });

            this.logger.log(`Created snapshot ${savedSnapshot.id} for process ${processId}`);

            return this.mapToResponseDto(snapshotWithRelations);
        } catch (error) {
            this.logger.error(`Failed to create snapshot for process ${processId}`, error);
            throw new InternalServerErrorException('Failed to create process snapshot');
        }
    }

    async getSnapshotHistory(
        processId: number,
        paging: Paging,
    ): Promise<Page<ProcessSnapshotResponseDto>> {
        this.logger.log(`Getting snapshot history for process ${processId}`);

        const processExists = await this.processRepository.exists({
            where: { id: processId },
        });

        if (!processExists) {
            throw new NotFoundException(`Process with id ${processId} not found`);
        }
        
        const options: FindManyOptions<ProcessSnapshotEntity> = {
            ...paging,
            where: { processId },
            relations: ['process', 'createdBy'],
            order: { versionNumber: 'DESC' },
        };
        
        const page = await getPage(this.processSnapshotRepository, options);
        
        return {
            ...page,
            content: page.content.map(snapshot => this.mapToResponseDto(snapshot))
        };
    }

    async getSnapshotDetails(snapshotId: number): Promise<ProcessSnapshotDetailResponseDto> {
        this.logger.log(`Getting details for snapshot ${snapshotId}`);

        const snapshot = await this.processSnapshotRepository.findOne({
            where: { id: snapshotId },
            relations: ['process', 'createdBy'],
        });

        if (!snapshot) {
            throw new NotFoundException(`Snapshot with id ${snapshotId} not found`);
        }

        try {
            const decompressedDefinition = await gunzipAsync(snapshot.processDefinition);
            const processDefinition = decompressedDefinition.toString('utf8');

            const responseDto = this.mapToResponseDto(snapshot) as ProcessSnapshotDetailResponseDto;
            responseDto.processDefinition = processDefinition;

            return responseDto;
        } catch (error) {
            this.logger.error(`Failed to decompress snapshot ${snapshotId}`, error);
            throw new InternalServerErrorException('Failed to retrieve snapshot details');
        }
    }

    async restoreSnapshot(
        snapshotId: number,
        userId: number,
    ): Promise<ProcessSnapshotResponseDto> {
        this.logger.log(`Restoring snapshot ${snapshotId} by user ${userId}`);

        const snapshot = await this.processSnapshotRepository.findOne({
            where: { id: snapshotId },
            relations: ['process', 'createdBy'],
        });

        if (!snapshot) {
            throw new NotFoundException(`Snapshot with id ${snapshotId} not found`);
        }

        try {
            const decompressedDefinition = await gunzipAsync(snapshot.processDefinition);
            const processDefinition = decompressedDefinition.toString('utf8');

            await this.processRepository.update(snapshot.processId, {
                definition: processDefinition,
                updated: new Date().toISOString(),
            });

            this.logger.log(`Restored process ${snapshot.processId} from snapshot ${snapshotId}`);

            return this.mapToResponseDto(snapshot);
        } catch (error) {
            this.logger.error(`Failed to restore snapshot ${snapshotId}`, error);
            throw new InternalServerErrorException('Failed to restore process from snapshot');
        }
    }

    private async getNextVersionNumber(processId: number): Promise<number> {
        const result = await this.processSnapshotRepository
            .createQueryBuilder('snapshot')
            .select('MAX(snapshot.versionNumber)', 'max')
            .where('snapshot.processId = :processId', { processId })
            .getRawOne();

        return (result?.max || 0) + 1;
    }
    
    private mapToResponseDto(snapshot: ProcessSnapshotEntity): ProcessSnapshotResponseDto {
        return {
            id: snapshot.id,
            processId: snapshot.processId,
            processName: snapshot.process.name,
            versionNumber: snapshot.versionNumber,
            name: snapshot.name,
            description: snapshot.description,
            createdByEmail: snapshot.createdBy.email,
            createdAt: snapshot.createdAt,
        };
    }
}
