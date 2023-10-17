import { StatelessActionHandler } from 'runbotics-sdk';
import child from 'child_process';
import { Injectable } from '@nestjs/common';
import * as VisualBasicTypes from './types';

@Injectable()
class VisualBasicActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async runMacro(input: VisualBasicTypes.RunMacroActionInput): Promise<VisualBasicTypes.RunMacroActionOutput> {
        const { spawn } = child;
        const scriptArguments = input.scriptArguments ? input.scriptArguments.split(',') : [];
        const scriptPathWithArguments = [input.scriptPath].concat(scriptArguments);
        const bat = spawn(
            'C:\\Windows\\SysWOW64\\wscript.exe',
            scriptPathWithArguments
        );

        let data = '';
        const exitCode = await new Promise((resolve, reject) => {
            bat.on('exit', resolve);
            data = 'Process exited.';
        });

        return {
            output: {
                data: data,
                exitCode: exitCode,
            },
        };
    }
    
    run(request: VisualBasicTypes.VisualBasicActionRequest) {
        switch (request.script) {
            case 'vBasic.runMacro':
                return this.runMacro(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}

export default VisualBasicActionHandler;
