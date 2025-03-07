import { Logger } from '#/utils/logger';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './license.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LicenseService {
    private readonly logger = new Logger(LicenseService.name);

    constructor(
        @InjectRepository(License)
        private readonly licenseRepository: Repository<License>
    ) {}

    async getAvailablePlugins({ tenantId }: User) {
        const licenses = await this.licenseRepository.findBy({ tenantId });

        return licenses
            .filter(this.isExpDateValid)
            .map(({ pluginName }) => pluginName);
    }

    async getLicenseInfo({ tenantId }: User, pluginName: string) {
        const license = await this.licenseRepository.findOneBy({
            tenantId,
            pluginName,
        });

        if (!license) {
            throw new NotFoundException();
        }
        if (!license || !this.isExpDateValid(license)) {
            throw new NotFoundException();
        }

        return license;
    }

    private isExpDateValid({ expDate }: License) {
        const currentDate = new Date();
        const expirationDate = new Date(expDate);
        return currentDate < expirationDate;
    }
}
