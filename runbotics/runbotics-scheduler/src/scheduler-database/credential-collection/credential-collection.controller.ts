import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import { CreateCredentialCollectionDto } from './dto/create-credential-collection.dto';
import { UpdateCredentialCollectionDto } from './dto/update-credential-collection.dto';

@Controller('credential-collection')
export class CredentialCollectionController {
  constructor(private readonly credentialCollectionService: CredentialCollectionService) {}

  @Post()
  create(@Body() createCredentialCollectionDto: CreateCredentialCollectionDto) {
    return this.credentialCollectionService.create(createCredentialCollectionDto);
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
  update(@Param('id') id: string, @Body() updateCredentialCollectionDto: UpdateCredentialCollectionDto) {
    return this.credentialCollectionService.update(+id, updateCredentialCollectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialCollectionService.remove(+id);
  }
}
