import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { IUser } from 'runbotics-common';

const relations = ['authorities'];

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    findAll(): Promise<IUser[]> {
        return this.userRepository.find({ relations });
    }

    findById(id: number): Promise<IUser> {
        return this.userRepository.findOne(id, { relations });
    }

    findByLogin(login: string): Promise<IUser> {
        return this.userRepository.findOne({ where: { login }, relations });
    }
}
