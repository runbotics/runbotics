import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { getCredentialTypeFromActionGroup } from './Credential.utils';

const getCredentialType = (element: BPMNElement): string => element?.businessObject?.credentialType
    ?? getCredentialTypeFromActionGroup(
        element?.businessObject?.actionId.split('.')[0]
    );

export default getCredentialType;
