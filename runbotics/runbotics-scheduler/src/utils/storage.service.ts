import { Injectable } from '@nestjs/common';
import { Logger } from './logger';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private memory: Record<string, any> = {};

    constructor() { }

    public removeItem(key: string): Promise<void> {
        return new Promise<void>((resolve) => {
            delete this.memory[key];
            resolve();
        });
    }

    public setItem(key: string, value: any): Promise<any> {
        this.logger.log(`Setting ${key} in storage`);

        return new Promise<any>((resolve) => {
            this.memory[key] = value;
            resolve({});
        });
    }

    public getItem(key: string): Promise<any> {
        this.logger.log(`Getting ${key} from storage`);

        return new Promise((resolve) => {
            const result = this.memory[key];
            resolve(result);
        });
    }
}
