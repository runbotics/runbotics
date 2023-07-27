export interface PythonShellConfig {
    mode: 'text' | 'json' | 'binary';
    pythonPath: string;
    pythonOptions: string[];
    scriptPath: string;
    args: string[];
}
