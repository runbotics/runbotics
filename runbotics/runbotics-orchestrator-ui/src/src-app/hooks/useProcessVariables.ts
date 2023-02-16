import useProcessActionVariables from './useProcessActionVariables';
import useProcessAttendedVariables from './useProcessAttendedVariables';
import useProcessGlobalVariables from './useProcessGlobalVariables';


const useProcessVariables = () => {
    const globalVariables = useProcessGlobalVariables();
    const {inputActionVariables, outputActionVariables} = useProcessActionVariables();
    const attendedVariables = useProcessAttendedVariables();

    console.log(inputActionVariables, outputActionVariables);

    return {
        globalVariables,
        inputActionVariables,
        outputActionVariables,
        attendedVariables
    };
};

export default useProcessVariables;
