import { useSelector } from '#src-app/store';
import { currentProcessSelector } from '#src-app/store/slices/Process';

const useProcessAttendedVariables = () => {
    const { isAttended } = useSelector(currentProcessSelector);
    const { passedInVariables } = useSelector((state) => state.process.modeler);

    const attendedVariables = isAttended
        ? [{ name: passedInVariables[0] }, { name: passedInVariables[1] }]
        : [];

    return attendedVariables;
};

export default useProcessAttendedVariables;
