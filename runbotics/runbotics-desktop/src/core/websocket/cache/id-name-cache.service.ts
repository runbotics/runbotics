import { Injectable } from '@nestjs/common';

@Injectable()
export class IdNameCacheService {
    private readonly cacheMap: Map<string, string>;
    
    constructor() {
        if (!this.cacheMap) {
            this.cacheMap = new Map<string, string>();
        }
    }

    setValue(key: string, value: string): void {
        this.cacheMap.set(key, value);
    }

    getValue(key: string): string {
        return this.cacheMap.get(key);
    }

    removeValue(key: string): void {
        this.cacheMap.delete(key);
    }
}
