import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post()
  create(@Body() createCredentialDto: CreateCredentialDto) {
    return this.credentialService.create(createCredentialDto);
  }

  @Get()
  findAll() {
    return this.credentialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCredentialDto: UpdateCredentialDto) {
    return this.credentialService.update(+id, updateCredentialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialService.remove(+id);
  }
}
