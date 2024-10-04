import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ErrorView from '../src-app/views/errors/ErrorView';

const ErrorPage  = () => {
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const { code } = router.query;

        if (!isNaN(Number(code))) {
            setErrorCode(Number(code));
        } else {
            const storedTitle = sessionStorage.getItem('errorTitle');
            const storedMessage = sessionStorage.getItem('errorMessage');

            setErrorTitle(storedTitle);
            setErrorMessage(storedMessage);

            sessionStorage.removeItem('errorTitle');
            sessionStorage.removeItem('errorMessage');
        }
    }, [router.query]);

    return (
        <ErrorView
            errorCode={errorCode}
            customTitle={errorTitle}
            customMessage={errorMessage}
        />
    );
};

export default ErrorPage;
