import { Injectable } from '@nestjs/common';
import { StatefulActionHandler } from 'runbotics-sdk';
import { DesktopRunRequest } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import * as vm from 'vm';
import * as fs from 'fs';
import { NodeVM, VMScript } from 'vm2';
import _ from 'lodash';
import ts from 'typescript';
import { StatelessActionHandler } from 'runbotics-sdk';
import { customServices } from '../../core/bpm/CustomServices';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import moment from 'moment';

export type JavaScriptActionRequest<I> = DesktopRunRequest<any> & {
    script: 'javascript.run' | 'typescript.run';
};

export type JavaScriptRunActionInput = {
    code: string;
    functionName: string;
    functionParams: any;
};

export type TypeScriptRunActionInput = {
    code: string;
    functionParams: any;
};

export type JavaScriptRunActionOutput = any;

@Injectable()
class JavaScriptActionHandler extends StatelessActionHandler {
    private logger = new RunboticsLogger(JavaScriptActionHandler.name);

    async runRemoteJavaScript(input: JavaScriptRunActionInput): Promise<JavaScriptRunActionOutput> {
        const script = new vm.Script(input.code);

        let contextObj = {
            console: {
                log: (...args) => {
                    this.logger.log(...args);
                },
            },
            customServices: customServices,
        };

        const vmContext = vm.createContext(contextObj);
        script.runInContext(vmContext);
        const result = vmContext[input.functionName](input.functionParams);
        return result;
    }

    async runRemoteTypeScript(input: TypeScriptRunActionInput): Promise<any> {
        const vm: NodeVM = new NodeVM({
            console: 'inherit',
            sandbox: {
                customServices: customServices,
            },
            require: {
                mock: {
                    moment: moment,
                },
            },
        });
        const transpiled = ts.transpile(input.code, {
            esModuleInterop: true,
        });
        const script: VMScript = new VMScript(transpiled);
        const functionInSandbox = vm.run(script);
        const resultProxy = await functionInSandbox(input.functionParams);
        const returned = _.cloneDeep(resultProxy);
        return returned;
    }

    async run(request: JavaScriptActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        switch (request.script) {
            case 'javascript.run':
                output = await this.runRemoteJavaScript(request.input);
                break;
            case 'typescript.run':
                output = await this.runRemoteTypeScript(request.input);
                break;
        }
        return {
            status: 'ok',
            output: output,
        };
    }
}

export default JavaScriptActionHandler;
