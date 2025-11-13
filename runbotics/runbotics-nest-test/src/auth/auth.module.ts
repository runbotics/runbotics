import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BasicStrategy } from './strategies/basic.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'superSecretKey',
            signOptions: { expiresIn: '1h', algorithm: 'HS512' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, BasicStrategy],
    exports: [AuthService],
})
export class AuthModule {}
