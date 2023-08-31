import { IProcess } from 'runbotics-common';

import useAuth from './useAuth';

export const useProcessOwner = (process: IProcess): boolean => {
    const { user } = useAuth();
    const userId = typeof user.id === 'number' ? user.id : Number(user.id);
    const isProcessOwner = userId === process.createdBy?.id;

    return isProcessOwner;
};
