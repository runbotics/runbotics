import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '#/scheduler-database/user/user.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { AuthUserDtoSchema } from '#/auth/dto/auth-user.dto';
import { JwtAuthGuard } from '#/auth/guards';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import {
    UpdateLanguageDto,
    UpdateLanguageSwaggerDto,
} from '#/scheduler-database/user/dto/update-language.dto';

@Controller('api/account')
export class UserAccountController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAccount(@UserDecorator() { email }: User) {
        return AuthUserDtoSchema.parse(
            await this.userService.findByEmailForAuth(email)
        );
    }

    @ApiOperation({
        summary: 'Update user language preference',
        description: `Updates the language preference for the currently authenticated user. 
            The language key must be one of the supported languages.
            This setting affects the language used in emails, notifications, and UI elements.`,
    })
    @ApiBody({
        type: UpdateLanguageSwaggerDto,
        description: 'Object containing the new language preference',
    })
    @ApiOkResponse({
        description:
            'Language preference successfully updated. Returns the updated user entity.',
    })
    @ApiBadRequestResponse({
        description:
            'Invalid request body. Language key must be one of the supported values.',
    })
    @ApiNotFoundResponse({
        description: 'User not found or language not updated.',
    })
    @ApiForbiddenResponse({
        description:
            'User does not have permission to update their language preference.',
    })
    @Patch('language')
    async updateLanguage(
        @UserDecorator() user: User,
        @Body() updateLanguageKey: UpdateLanguageDto
    ) {
        return await this.userService.updateLanguage(
            user.id,
            updateLanguageKey.langKey
        );
    }
}
