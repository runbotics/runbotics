import { IProcess } from 'runbotics-common';

import useAuth from './useAuth';

export const useProcessOwner = (process: IProcess): boolean => {
    const { user } = useAuth();
    const isProcessOwner = user.id === process.createdBy?.id;

    return isProcessOwner;
};
