import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Language, SupportedLanguage } from 'runbotics-common';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) {}

    async updateLanguage(userId: number, langKey: string): Promise<User> {
        const supportedLanguages = Object.values(Language);
        
        if (!supportedLanguages.includes(langKey as SupportedLanguage)) {
            throw new BadRequestException(
                `Language '${langKey}' is not supported. Supported languages: ${supportedLanguages.join(', ')}`
            );
        }
        const updateResult = await this.repo.update(userId, { langKey });
        
        if (updateResult.affected === 0) {
            throw new BadRequestException('User not found or language not updated');
        }

        return await this.repo.findOne({ where: { id: userId } });
    }
}