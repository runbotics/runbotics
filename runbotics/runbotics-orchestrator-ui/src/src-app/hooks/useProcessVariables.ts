import useProcessActionVariables from './useProcessActionVariables';
import useProcessAttendedVariables from './useProcessAttendedVariables';
import useProcessGlobalVariables from './useProcessGlobalVariables';

const useProcessVariables = (selectedElementParentId?: string) => {
    const globalVariables = useProcessGlobalVariables();
    const { inputActionVariables, outputActionVariables, loopVariables } =
        useProcessActionVariables(selectedElementParentId);
    const attendedVariables = useProcessAttendedVariables();

    return {
        globalVariables,
        inputActionVariables,
        outputActionVariables,
        attendedVariables,
        loopVariables,
    };
};

export default useProcessVariables;
