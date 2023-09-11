import useAuth from './useAuth';

export const useOwner = () => {
    const { user } = useAuth();

    return (ownerId: number) => {
        const isOwner = user.id === ownerId;

        return isOwner;
    };
};
