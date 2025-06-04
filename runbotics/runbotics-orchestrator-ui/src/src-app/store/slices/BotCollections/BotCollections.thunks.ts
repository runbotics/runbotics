import { BotCollectionDto, IBotCollection } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';

import { Page } from '../../../utils/types/page';

const BOT_COLLECTIONS_PATH = 'bot-collections';

export const getAll = ApiTenantResource.get<BotCollectionDto[]>(
    'botCollection/getAllForUser',
    `${BOT_COLLECTIONS_PATH}`,
);

export const getByPage = ApiTenantResource.get<Page<BotCollectionDto>>(
    'botCollection/getPageForUser',
    `${BOT_COLLECTIONS_PATH}/GetPage`,
);

export const deleteOne = ApiTenantResource.delete(
    'botCollection/delete',
    BOT_COLLECTIONS_PATH,
);

export const updateOne = ApiTenantResource.patch<IBotCollection, IBotCollection>(
    'botCollection/updateCollection',
    BOT_COLLECTIONS_PATH,
);

export const createOne = ApiTenantResource.post<IBotCollection, IBotCollection>(
    'botCollection/createOne',
    BOT_COLLECTIONS_PATH,
);
