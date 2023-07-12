import { PythonShellConfig } from './action.types';
import { PythonShell } from 'python-shell';

export const runPythonScript = async (args, pythonScriptDirectory, pythonScriptName) => {
    const options: PythonShellConfig = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'], // print results in real-time
        scriptPath: pythonScriptDirectory,
        args: [...args],
    };

    return PythonShell
        .run(pythonScriptName, options)
        .then(messages => messages) // array of messages printed by python script
        .catch(
            error => {
                throw error;
            }
        );
};
