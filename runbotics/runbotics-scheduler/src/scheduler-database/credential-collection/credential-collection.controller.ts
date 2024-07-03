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
import { UserEntity } from '#/database/user/user.entity';

@Controller('credential-collections')
export class CredentialCollectionController {
    private readonly logger = new Logger(CredentialCollectionController.name);
    constructor(
        private readonly credentialCollectionService: CredentialCollectionService
    ) {}

    @Post()
    async createCredentialCollection(
        @Body(new ZodValidationPipe(createCredentialCollectionSchema))
        createCredentialCollectionDto: CreateCredentialCollectionDto,
        @Request() request: AuthRequest
    ) {
        this.logger.log(
            '=> Creating new credential collection: ',
            createCredentialCollectionDto
        );

        const collection = await this.credentialCollectionService.create(
            createCredentialCollectionDto,
            request.user as UserEntity
        );

        this.logger.log('<= Created new credential collection: ', collection);

        return collection;
    }

    @Get()
    findAllCredentialCollections(@Request() request: AuthRequest) {
        this.logger.log('=> Getting all credential collections');

        return this.credentialCollectionService.findAll(
            request.user as UserEntity
        );
    }

    @Get(':id')
    findOneCredentialCollection(
        @Param('id') id: string,
        @Request() request: AuthRequest
    ) {
        this.logger.log(`=> Getting credential collection with id (${id})`);

        return this.credentialCollectionService.findOne(
            id,
            request.user as UserEntity
        );
    }

    @Patch(':id')
    updateCredentialCollection(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateCredentialCollectionSchema))
        updateCredentialCollectionDto: UpdateCredentialCollectionDto,
        @Request() request: AuthRequest
    ) {
        this.logger.log(`=> Updating credential collection with id (${id})`);

        return this.credentialCollectionService.update(
            id,
            updateCredentialCollectionDto,
            request.user as UserEntity
        );
    }

    @Delete(':id')
    removeCredentialCollection(@Param('id') id: string) {
        this.logger.log(`=> Deleting credential collection with id (${id})`);

        return this.credentialCollectionService.remove(id);
    }
}
