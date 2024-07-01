import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import { CreateCredentialCollectionDto, createCredentialCollectionSchema } from './dto/create-credential-collection.dto';
import { UpdateCredentialCollectionDto, updateCredentialCollectionSchema } from './dto/update-credential-collection.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';

@Controller('credential-collections')
export class CredentialCollectionController {
  constructor(private readonly credentialCollectionService: CredentialCollectionService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createCredentialCollectionSchema)) collectionDto: CreateCredentialCollectionDto) {
    return this.credentialCollectionService.create(collectionDto);
  }

  @Get()
  findAll() {
    return this.credentialCollectionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialCollectionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialCollectionSchema)) collectionDto: UpdateCredentialCollectionDto) {
    return this.credentialCollectionService.update(+id, collectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialCollectionService.remove(+id);
  }
}
