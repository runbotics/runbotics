import { Injectable } from '@nestjs/common';
import { StatelessActionHandler, DesktopRunRequest } from '@runbotics/runbotics-sdk';
import * as vm from 'vm';
import _ from 'lodash';
import { NodeVM, VMScript } from 'vm2';
import ts from 'typescript';
import moment from 'moment';
import { customServices } from '#core/bpm/CustomServices';
import { RunboticsLogger } from '#logger';

export type JavaScriptActionRequest =
| DesktopRunRequest<'javascript.run', JavaScriptRunActionInput>
| DesktopRunRequest<'typescript.run', TypeScriptRunActionInput>;

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
export default class JavaScriptActionHandler extends StatelessActionHandler {
    private logger = new RunboticsLogger(JavaScriptActionHandler.name);

    async runRemoteJavaScript(input: JavaScriptRunActionInput): Promise<JavaScriptRunActionOutput> {
        const script = new vm.Script(input.code);

        const contextObj = {
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
        // use structuredClone when node 17
        const returned = _.cloneDeep(resultProxy);
        return returned;
    }

    run(request: JavaScriptActionRequest) {
        switch (request.script) {
            case 'javascript.run':
                return this.runRemoteJavaScript(request.input);
            case 'typescript.run':
                return this.runRemoteTypeScript(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
