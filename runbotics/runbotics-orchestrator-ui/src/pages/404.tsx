import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { setErrorCode } from '../src-app/store/slices/Views/httpErrorSlice';
import ErrorView from '../src-app/views/errors/ErrorView';

const NotFoundPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setErrorCode(404));
        router.replace('/404', undefined, { shallow: true });
    }, [router, dispatch]);

    return <ErrorView />;
};

export default NotFoundPage;
