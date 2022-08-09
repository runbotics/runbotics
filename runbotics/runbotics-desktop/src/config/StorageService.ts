import { Injectable, Logger } from '@nestjs/common';
import { RunboticsLogger } from '../logger/RunboticsLogger';

@Injectable()
export class StorageService {
    private readonly logger = new RunboticsLogger(StorageService.name);
    private memory: Record<string, any> = {};

    constructor() {}

    public removeItem(key: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            delete this.memory[key];
            resolve();
        });
    }

    public setItem(key: string, value: any): Promise<any> {
        this.logger.log('Setting item in storage ' + key);

        return new Promise<any>(async (resolve) => {
            this.memory[key] = value;
            resolve({});
        });
    }

    public getItem(key: string, initialValue?: any): Promise<any> {
        this.logger.log('Getting item from storage ' + key);
        return new Promise(async (resolve) => {
            const result = this.memory[key];
            resolve(result);
        });
    }
}
