import { Guest } from '#src-app/types/guest';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

const GUESTS_PATH = 'guests';

export const getCurrentGuest = ApiTenantResource.get<Guest>(
    'guests/getCurrentGuest', `${GUESTS_PATH}/user`
);
