import { Body, Controller, Patch } from '@nestjs/common';
import { User } from 'runbotics-common';
import { AccountService } from './account.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { ApiBadRequestResponse, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateLanguageDto, UpdateLanguageSwaggerDto } from './dto/update-language.dto';

@Controller('api/account')
@ApiTags('Account')
export class AccountController {
    constructor(private readonly service: AccountService) {}


    @ApiOperation({
        summary: 'Update user language preference',
        description: `Updates the language preference for the currently authenticated user. 
            The language key must be one of the supported languages.
            This setting affects the language used in emails, notifications, and UI elements.`
    })
    @ApiBody({
        type: UpdateLanguageSwaggerDto,
        description: 'Object containing the new language preference',
    })
    @ApiOkResponse({
        description: 'Language preference successfully updated. Returns the updated user entity.',
    })
    @ApiBadRequestResponse({
        description: 'Invalid request body. Language key must be one of the supported values.',
    })
    @ApiNotFoundResponse({
        description: 'User not found or language not updated.',
    })
    @ApiForbiddenResponse({
        description: 'User does not have permission to update their language preference.',
    })
    @Patch('language')
    async updateLanguage(
        @UserDecorator() user: User,
        @Body() updateLanguageKey: UpdateLanguageDto,
    ) {
        return await this.service.updateLanguage(user.id, updateLanguageKey.langKey);
    }
}