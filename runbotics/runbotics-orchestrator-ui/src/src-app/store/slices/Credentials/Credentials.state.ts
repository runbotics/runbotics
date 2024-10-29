import { Credential } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface CredentialsState {
    all: Credential[];
    allByTemplateAndProcess: Credential[];
    allByPage: Page<Credential>
    loading: boolean;
}
