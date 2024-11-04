import { Credential, FrontCredentialDto, ProcessCredential } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface CredentialsState {
    all: FrontCredentialDto[];
    allByTemplateAndProcess: Credential[];
    allProcessAssigned: ProcessCredential[];
    allByPage: Page<FrontCredentialDto>
    loading: boolean;
}
