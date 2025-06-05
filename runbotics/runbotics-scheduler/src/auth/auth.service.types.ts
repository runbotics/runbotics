import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';

import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { MicrosoftAuthDto } from './dto/microsoft-auth.dto';

export interface MutableBotParams {
    collection: BotCollection;
    system: BotSystem;
    version: string;
    user: User;
}

export interface RegisterNewBotParams extends MutableBotParams {
    user: User;
    installationId: string;
}

export interface MsalSsoUserDto {
    msTenantId: string,
    email: string,
    langKey: string;
}

export interface MicrosoftSSOUserDto
    extends Omit<MicrosoftAuthDto, 'accessToken'> {
    email: string;
}
