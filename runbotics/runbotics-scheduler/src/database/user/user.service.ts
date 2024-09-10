import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUser, Role } from 'runbotics-common';

const relations = ['authorities'];

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {}

    findAll(): Promise<IUser[]> {
        return this.userRepository.find({ relations });
    }

    findAllByRole(role: Role): Promise<IUser[]> {
        return this.userRepository.find({
            where: {
                authorities: {
                    name: role,
                },
            },
            relations,
        });
    }

    findById(id: number): Promise<IUser> {
        return this.userRepository.findOne({ where: { id }, relations });
    }

    findByLogin(login: string): Promise<IUser> {
        return this.userRepository.findOne({ where: { login }, relations });
    }

    findAllByEmails(emails: string[], tenantId: string) {
        return this.userRepository.find({
            where: {
                tenantId,
                email: In(emails),
            },
        });
    }
}
