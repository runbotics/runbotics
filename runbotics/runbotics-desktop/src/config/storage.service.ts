import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '../logger/RunboticsLogger';

@Injectable()
export class StorageService {
    private readonly logger = new RunboticsLogger(StorageService.name);
    private readonly storage: Map<string, string>;

    constructor() {
        if (!this.storage) {
            this.storage = new Map<string, string>();
        }
    }

    setValue(key: string, value: string): void {
        this.logger.log('Setting item in storage ' + key);
        this.storage.set(key, value);
    }

    getValue(key: string): string {
        this.logger.log('Getting item from storage ' + key);
        return this.storage.get(key);
    }

    removeValue(key: string): void {
        this.storage.delete(key);
    }
}
