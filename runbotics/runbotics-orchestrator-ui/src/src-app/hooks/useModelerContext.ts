import { useContext } from 'react';

import { ModelerContext } from '#src-app/providers/ModelerProvider';

export const useModelerContext = () => {
    const context = useContext<ModelerContext>(ModelerContext);
    return context;
};
