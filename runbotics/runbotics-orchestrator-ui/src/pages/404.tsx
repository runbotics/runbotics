import { useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { setErrorCode } from '#src-app/store/slices/Views/httpErrorSlice';

import ErrorView from '../src-app/views/errors/ErrorView';

const NotFoundPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setErrorCode(404));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <ErrorView/>;
};

export default NotFoundPage;
