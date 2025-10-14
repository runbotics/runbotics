import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { UpdateAttendedDto } from './update-attended.dto';
import { UpdateProcessBotCollectionDto } from './update-process-bot-collection.dto';
import { UpdateProcessBotSystemDto } from './update-process-bot-system.dto';
import { UpdateProcessOutputTypeDto } from './update-process-output-type.dto';
import { UpdateTriggerableDto } from './update-triggerable.dto';
import { UpdateExecutionInfoDto } from './update-execution-info.dto';
import { createZodDto } from 'nestjs-zod';

export const updateProcessSchema = createProcessSchema.omit({
    executionInfo: true,
    isAttended: true,
    isTriggerable: true,
    system: true,
    output: true,
});

export class UpdateProcessSwaggerDto extends createZodDto(updateProcessSchema) {}
export type UpdateProcessDto = z.infer<typeof updateProcessSchema>;

export type PartialUpdateProcessDto =
    UpdateExecutionInfoDto |
    UpdateAttendedDto |
    UpdateTriggerableDto |
    UpdateProcessBotCollectionDto |
    UpdateProcessBotSystemDto |
    UpdateProcessOutputTypeDto;
