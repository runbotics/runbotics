import { Body, Controller, Post } from '@nestjs/common';
import { Public } from './guards';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import {
    MicrosoftAuthDto,
    microsoftAuthSchema,
} from './dto/microsoft-auth.dto';

@Controller('/api/scheduler/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('microsoft')
    async authenticateWithMicrosoft(
        @Body(new ZodValidationPipe(microsoftAuthSchema))
        microsoftAthDto: MicrosoftAuthDto
    ) {
        const tokenPayload =
            await this.authService.validateMicrosoftAccessToken(
                microsoftAthDto.idToken
            );

        const email = tokenPayload['preferred_username'];
        const accessToken = await this.authService.handleMicrosoftSSOUserAuth({
            ...microsoftAthDto,
            email,
        });

        return { accessToken };
    }
}
