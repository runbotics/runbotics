import useProcessActionVariables from './useProcessActionVariables';
import useProcessAttendedVariables from './useProcessAttendedVariables';
import useProcessGlobalVariables from './useProcessGlobalVariables';


const useProcessVariables = () => {
    const globalVariables = useProcessGlobalVariables();
    const actionVariables = useProcessActionVariables();
    const attendedVariables = useProcessAttendedVariables();

    return {
        globalVariables,
        actionVariables,
        attendedVariables
    };
};

export default useProcessVariables;
