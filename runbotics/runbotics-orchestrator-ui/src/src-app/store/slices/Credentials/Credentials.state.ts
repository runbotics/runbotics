import { Credential, ProcessCredential } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface CredentialsState {
    all: Credential[];
    allByTemplateAndProcess: Credential[];
    allProcessAssigned: ProcessCredential[];
    allByPage: Page<Credential>
    loading: boolean;
}
