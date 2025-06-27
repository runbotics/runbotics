import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RequestService } from './request.service';

@Module({
    imports: [
        ConfigModule
    ],
    providers: [
        AuthService,
        RequestService,
    ],
    exports: [
        AuthService,
        RequestService
    ]
})
export class AuthModule { }
