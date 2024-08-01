import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { Repository } from 'typeorm';
import { AuthRequest } from '#/types';

const relations = ['attributes'];

@Injectable()
export class CredentialService {
  private readonly logger = new Logger(CredentialService.name);

  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
  ) { }

  async create(credentialDto: CreateCredentialDto, request: AuthRequest) {
    const { user: { id: userId, tenantId } } = request;

    const credential = this.credentialRepo.create({
      ...credentialDto,
      createdById: userId,
      updatedById: userId,
      tenantId,
    });

    return this.credentialRepo.save(credential)
      .catch(async (error) => {
        await this.validateName(credentialDto.name, userId);
        throw new BadRequestException(error.message);
      });
  }

  async findAllAccessibleByCollectionId(request: AuthRequest) {
    const { user: { id: userId, tenantId } } = request;
    return this.credentialRepo.find({
      where: {
        tenantId
        // @todo has access to by shared collection
      },
      relations
    });
  }

  async findOneById(id: string) {
    const result = await this.credentialRepo.findOne({
      where: {
        id
      },
      relations
    });

    if (!result) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    return result;
  }

  async findById(id: string, tenantId: string) {
    const credential = await this.credentialRepo.findOne({
      where: {
        id,
        tenantId
      },
      relations
    });

    if (!credential) {
      throw new NotFoundException(`Could not find credential with id ${id}`);
    }

    return credential;
  }

  async updateById(id: string, credentialDto: UpdateCredentialDto, request: AuthRequest) {
    const { user: { id: userId } } = request;

    const credential = await this.findOneById(id);
    const credentialToUpdate = this.credentialRepo.create({
      ...credentialDto,
      id,
      updatedById: userId,
      tenantId: credential.tenantId,
    });

    return this.credentialRepo.save(credentialToUpdate)
      .catch(async (error) => {
        await this.validateName(credentialToUpdate.name, userId);
        throw new BadRequestException(error.message);
      });
  }

  async removeById(id: string) {
    const credential = await this.findOneById(id);
    return this.credentialRepo.remove(credential);
  }

  async checkIsNameTaken(name: string, userId: number) {
    const result = await this.credentialRepo.findOne({
      where: {
        name,
        createdById: userId,
      }
    });
    return Boolean(result);
  }

  private async validateName(name: string, userId: number) {
    const isNameTaken = await this.checkIsNameTaken(name, userId);

    if (isNameTaken) {
      throw new BadRequestException('Name already taken. One user cannot have two credentials with the same name.');
    }
  }
}
