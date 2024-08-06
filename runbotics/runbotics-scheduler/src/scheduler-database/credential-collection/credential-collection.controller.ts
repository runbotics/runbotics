import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
} from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import {
    CreateCredentialCollectionDto,
    createCredentialCollectionSchema,
} from './dto/create-credential-collection.dto';
import {
    UpdateCredentialCollectionDto,
    updateCredentialCollectionSchema,
} from './dto/update-credential-collection.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { Logger } from '#/utils/logger';
import { AuthRequest } from '#/types';
import { User } from '#/utils/decorators/user.decorator';
import { IUser } from 'runbotics-common';

@Controller('api/scheduler/tenants/:tenantId/credential-collections')
export class CredentialCollectionController {
    private readonly logger = new Logger(CredentialCollectionController.name);
    constructor(
        private readonly credentialCollectionService: CredentialCollectionService
    ) {}

    @Post()
    async create(
        @Body(new ZodValidationPipe(createCredentialCollectionSchema))
        createCredentialCollectionDto: CreateCredentialCollectionDto,
        @User() user: IUser,
    ) {
        this.logger.log('Creating new credential collection');

        const collection = await this.credentialCollectionService.create(
            createCredentialCollectionDto,
            user,
        );

        this.logger.log('Created new credential collection: ', JSON.stringify(collection, null, 2));

        return collection;
    }

    @Get()
    findAll(@Request() request: AuthRequest) {
        this.logger.log('Getting all credential collections');

        return this.credentialCollectionService.findAll(request.user);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Request() request: AuthRequest
    ) {
        this.logger.log(`Getting credential collection with id (${id})`);

        return this.credentialCollectionService.findOneById(id, request.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateCredentialCollectionSchema))
        updateCredentialCollectionDto: UpdateCredentialCollectionDto,
        @Request() request: AuthRequest
    ) {
        this.logger.log(`Updating credential collection with id (${id})`);

        return this.credentialCollectionService.update(
            id,
            updateCredentialCollectionDto,
            request.user,
        );
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        this.logger.log(`Deleting credential collection with id (${id})`);

        return this.credentialCollectionService.remove(id);
    }
}
