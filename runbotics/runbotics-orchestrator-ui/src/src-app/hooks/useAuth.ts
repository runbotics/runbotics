import { useSelector } from '../store';

const useAuth = () => useSelector((state) => state.auth);

export default useAuth;
