import { Logger } from '#/utils/logger';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { License } from './license.entity';
import { Repository } from 'typeorm';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

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

        if (!license || !this.isExpDateValid(license)) {
            throw new NotFoundException();
        }

        return license;
    }

    async countLicensesByTenant(tenantId: string): Promise<number> {
        const licenses = await this.licenseRepository.findBy({ tenantId });

        const resp = licenses.filter(this.isExpDateValid);

        return resp.length;
    }

    async create(licenseDto: CreateLicenseDto): Promise<License> {
        const isLicenseKeyUsed = await this.licenseRepository.findOneBy({
            licenseKey: licenseDto.licenseKey,
        });
        if (isLicenseKeyUsed)
            throw new BadRequestException(
                'License already used',
                'LicenseUsed'
            );

        const newLicense = new License();
        newLicense.tenantId = licenseDto.tenantId;
        newLicense.pluginName = licenseDto.pluginName;
        newLicense.licenseKey = licenseDto.licenseKey;
        newLicense.license = licenseDto.license;
        newLicense.expDate = licenseDto.expDate;

        return this.licenseRepository.save(newLicense);
    }

    async update(licenseDto: UpdateLicenseDto, id: string): Promise<License> {
        const license = await this.licenseRepository
            .findOneByOrFail({ id })
            .catch(() => {
                this.logger.error('Cannot find license with id: ', id);
                throw new BadRequestException('License not found', 'NotFound');
            });

        if (!this.isExpDateValid(licenseDto)) {
            throw new BadRequestException(
                'Cant update date to expired one',
                'InvalidDate'
            );
        }

        license.expDate = licenseDto.expDate;
        license.license = licenseDto.license;
        license.licenseKey = licenseDto.licenseKey;


        return this.licenseRepository.save(license);
    }

    async getAllLicensesByTenant(tenantId: string): Promise<License[]> {
        const licenses = await this.licenseRepository.findBy({ tenantId });

        return this.sortLicenses(licenses);
    }

    private isExpDateValid({ expDate }: License | UpdateLicenseDto) {
        const currentDate = new Date();
        const expirationDate = new Date(expDate);
        return currentDate < expirationDate;
    }

    private sortLicenses(licensesArray: License[]) {
        return licensesArray.slice().sort((a, b) => {
            const isaValid = this.isExpDateValid(a);
            const isbValid = this.isExpDateValid(b);

            if (isaValid && !isbValid) {
                return -1;
            }

            if (!isaValid && isbValid) {
                return 1;
            }

            const aExpDate = new Date(a.expDate);
            const bExpDate = new Date(b.expDate);

            if (!isaValid && !isbValid) {
                return bExpDate.getTime() - aExpDate.getTime();
            }
            return aExpDate.getTime() - bExpDate.getTime();
        });
    }
}
