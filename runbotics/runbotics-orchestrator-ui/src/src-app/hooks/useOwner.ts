import useAuth from './useAuth';

export const useOwner = () => {
    const { user } = useAuth();

    const isOwner = (ownerId: number) => user.id === ownerId;

    return isOwner;
};
