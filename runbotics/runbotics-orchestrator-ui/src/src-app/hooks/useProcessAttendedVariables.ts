import { useSelector } from '#src-app/store';
import { currentProcessSelector } from '#src-app/store/slices/Process';

const useProcessAttendedVariables = () => {
    const { executionInfo, isAttended } = useSelector(currentProcessSelector);
    const { passedInVariables } = useSelector((state) => state.process.modeler);
    
    if (!isAttended) {
        return [];
    }

    const inOutInfo = JSON.parse(executionInfo);    

    const attendedVariables =
        isAttended && executionInfo
            ? [{name: passedInVariables[0], inOutInfo}, {name: passedInVariables[1], inOutInfo}]
            : [];

    return attendedVariables;
};

export default useProcessAttendedVariables;
