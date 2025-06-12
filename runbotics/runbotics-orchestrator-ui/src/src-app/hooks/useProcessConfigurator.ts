
import { Role } from 'runbotics-common';


import { useSelector } from '#src-app/store';

import { processSelector } from '#src-app/store/slices/Process';

import { useOwner } from './useOwner';
import useRole from './useRole';


const useProcessConfigurator = () => {
    const { draft: { process} } = useSelector(processSelector);
    const isProcessOwner = useOwner();
    const isTenantAdmin = useRole([Role.ROLE_TENANT_ADMIN]);

    return isProcessOwner(process.createdBy?.id) || isTenantAdmin;
};

export default useProcessConfigurator;
