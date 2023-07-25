import { PythonShellConfig } from './action.types';
import { PythonShell } from 'python-shell';

/**
 *  @name Run Python Script
 *  @description Runs desired .py file with given arguments.
 *  @param args - Array of arguments to be passed to python script.
 *  @param pythonScriptDirectory - Path to directory with python script file.
 *  @param pythonScriptName - Name of the .py file.
 *  @example
 *      args: ['C:/myDir/myExcelFile.xlsx', 'A', 1, 'myValue']
 *      pythonScriptDirectory: './src/action/excel/python'
 *      pythonScriptName: 'set_cell_value.py');
 *  @returns array of python messages (prints) or thrown error.
 */
export const runPythonScript = async (args, pythonScriptDirectory, pythonScriptName) => {
    const options: PythonShellConfig = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: pythonScriptDirectory,
        args: [...args],
    };

    return PythonShell
        .run(pythonScriptName, options)
        .catch(error => { throw error; });
};
