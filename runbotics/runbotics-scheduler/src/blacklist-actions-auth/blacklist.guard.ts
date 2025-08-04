import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { BlacklistActionAuthService } from '#/blacklist-actions-auth/blacklist-action-auth.service';
import { UpdateProcessDto, updateProcessSchema } from '#/scheduler-database/process/dto/update-process.dto';
import { CreateProcessDto, createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { UpdateDiagramDto, updateDiagramSchema } from '#/scheduler-database/process/dto/update-diagram.dto';

@Injectable()
export class BlacklistGuard implements CanActivate {

    constructor(private readonly blacklistAuthService: BlacklistActionAuthService) {
    }

    private checkBodyType(body?: unknown) {
        const createSchema = createProcessSchema.safeParse(body);
        if (createSchema.success) {
            return createSchema.data as CreateProcessDto;
        }
        const updateSchema = updateProcessSchema.safeParse(body);
        if (updateSchema.success) {
            return updateSchema.data as UpdateProcessDto;
        }
        const updateDiagram = updateDiagramSchema.safeParse(body);
        if (updateDiagram.success) {
            return updateDiagram.data as UpdateDiagramDto;
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        // -1 so that if the processId is not provided, it will not be blacklisted
        const processId = Number(request.params.processId ?? request.params.id ?? -1);

        const body = request.body;
        let isBlacklisted = false;

        if (body && this.checkBodyType(body)) {
            isBlacklisted = await this.blacklistAuthService.checkProcessActionsBlacklistByDefinition(body.definition);
        }
        isBlacklisted = processId !== -1 && await this.blacklistAuthService.checkProcessActionsBlacklist(processId);
        
        return !isBlacklisted;
    }
}
