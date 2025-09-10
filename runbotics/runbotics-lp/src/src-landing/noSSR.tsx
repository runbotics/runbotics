import { useEffect, useState } from 'react';
 
interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}
 
export const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
    const [hasMounted, setHasMounted] = useState(false);
 
    useEffect(() => {
        setHasMounted(true);
    }, []);
 
    if (!hasMounted) {
        return <>{fallback}</>;
    }
 
    return <>{children}</>;
};
