import { Injectable } from '@nestjs/common';
import { CreateCredentialCollectionDto } from './dto/create-credential-collection.dto';
import { UpdateCredentialCollectionDto } from './dto/update-credential-collection.dto';

@Injectable()
export class CredentialCollectionService {
  create(createCredentialCollectionDto: CreateCredentialCollectionDto) {
    return 'This action adds a new credentialCollection';
  }

  findAll() {
    return `This action returns all credentialCollection`;
  }

  findOne(id: number) {
    return `This action returns a #${id} credentialCollection`;
  }

  update(id: number, updateCredentialCollectionDto: UpdateCredentialCollectionDto) {
    return `This action updates a #${id} credentialCollection`;
  }

  remove(id: number) {
    return `This action removes a #${id} credentialCollection`;
  }
}
