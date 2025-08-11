import { Body, Controller, Param, ParseUUIDPipe } from '@nestjs/common';
import { ActionBlacklistService } from './action-blacklist.service';
import {
    UpdateActionBlacklistDto,
    updateActionBlacklistSchema,
    UpdateActionBlacklistZodDto,
} from './dto/action-blacklist.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetWithTenant, PatchWithTenant } from '#/utils/decorators/with-tenant.decorator';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';

//NOTE: Create and Delete operations commented for now, because the ActionBlacklist is for now a singleton table with one row.
@Controller('api/scheduler')
@ApiTags('ActionBlacklist')
export class ActionBlacklistController {
    constructor(private readonly service: ActionBlacklistService) {
    }

    // @PostWithTenant('action-blacklist')
    // @ApiOperation({ summary: 'Create a new ActionBlacklist entry' })
    // @ApiBody({ type: () => CreateActionBlacklistZodDto })
    // @ApiResponse({ status: 201, description: 'Created successfully' })
    // create(
    //     @Body(new ZodValidationPipe(createActionBlacklistSchema)) dto: CreateActionBlacklistDto,
    // ) {
    //     return this.service.create(dto);
    // }

    @GetWithTenant('action-blacklist')
    @ApiOperation({ summary: 'Retrieve all ActionBlacklist entries' })
    findAll() {
        return this.service.findAll();
    }

    @GetWithTenant('action-blacklist/current')
    @ApiOperation({ summary: 'Get ActionBlacklist by ID' })
    findOne() {
        return this.service.findCurrent();
    }

    @PatchWithTenant('action-blacklist/:id')
    @ApiOperation({ summary: 'Update ActionBlacklist by ID' })
    @ApiBody({ type: () => UpdateActionBlacklistZodDto })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body(new ZodValidationPipe(updateActionBlacklistSchema)) dto: UpdateActionBlacklistDto,
    ) {
        return this.service.update(id, dto);
    }

    // @DeleteWithTenant('action-blacklist/:id')
    // @ApiOperation({ summary: 'Delete ActionBlacklist by ID' })
    // remove(@Param('id', ParseUUIDPipe) id: string) {
    //     return this.service.remove(id);
    // }
}
