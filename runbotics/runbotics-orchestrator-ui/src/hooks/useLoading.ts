import { useEffect, useState } from 'react';
import { LOADING_DEBOUNCE } from 'src/views/process/ProcessBrowseView/ProcessList/ProcessList.utils';

const useLoading = (isLoading: boolean, delay = LOADING_DEBOUNCE) => {
    const [isDelayPassed, setIsDelayPassed] = useState(!isLoading);
    const [showLoading, setShowLoading] = useState(isLoading);

    useEffect(() => {
        if (!isLoading && isDelayPassed) {
            setShowLoading(false);
            return;
        }

        setIsDelayPassed(false);
        setShowLoading(true);

        const id = setTimeout(() => {
            setIsDelayPassed(true);
            clearTimeout(id);
        }, delay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, delay]);

    useEffect(() => {
        setShowLoading(isLoading);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDelayPassed]);

    return showLoading;
};

export default useLoading;
