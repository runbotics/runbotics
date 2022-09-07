import React, { useEffect, useState } from "react";
import { LOADING_DEBOUNCE } from "src/views/process/ProcessBrowseView/ProcessList/ProcessList.utils";

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
            console.log('timeout');
            
        }, delay);

        console.log('1', isLoading, delay);
        
    }, [isLoading, delay]);

    useEffect(() => {
        setShowLoading(isLoading);

        console.log('2', isDelayPassed);
    }, [isDelayPassed]);

    return showLoading;
}

export default useLoading;