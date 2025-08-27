import { useCallback } from 'react';

import { useDispatch, useSelector } from '#src-app/store';
import { ModelerErrorType, processActions } from '#src-app/store/slices/Process';
import getElementLabel from '#src-app/utils/getElementLabel';

type CustomValidator = () => boolean;

const useCustomValidation = () => {
    const { selectedElement } = useSelector(state => state.process.modeler);
    const dispatch = useDispatch();

    const validator = useCallback((customValidator: CustomValidator) => {
        const isValid = customValidator();
        if (isValid) {
            dispatch(processActions.removeCustomValidationError(selectedElement.id));
        } else {
            dispatch(processActions.setCustomValidationError({
                elementId: selectedElement.id,
                elementName: getElementLabel(selectedElement),
                type: ModelerErrorType.FORM_ERROR,
            }));
        }
        return isValid;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedElement]);

    return { validator };
};

export default useCustomValidation;
