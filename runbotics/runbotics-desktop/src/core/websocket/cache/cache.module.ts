import { Global, Module } from '@nestjs/common';
import { IdNameCacheService } from './id-name-cache.service';


@Global()
@Module({
    providers: [
        IdNameCacheService,
    ],
    exports: [IdNameCacheService],
})
export class CacheModule {}
