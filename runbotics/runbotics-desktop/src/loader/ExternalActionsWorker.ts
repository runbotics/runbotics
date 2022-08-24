import { parentPort, workerData } from 'worker_threads';
import { Type } from '@nestjs/common';
import { DesktopRunRequest } from 'runbotics-sdk';
import { get } from 'lodash';
import { set } from 'lodash';
import path from 'path';

console.log = function (message?: any, ...optionalParams: any[]) {
    parentPort.postMessage({
        event: 'log',
        data: {
            type: 'info',
            data: [message, ...optionalParams],
        },
    });
};
console.info = function (message?: any, ...optionalParams: any[]) {
    parentPort.postMessage({
        event: 'log',
        data: {
            type: 'info',
            data: [message, ...optionalParams],
        },
    });
};
console.error = function (message?: any, ...optionalParams: any[]) {
    parentPort.postMessage({
        event: 'log',
        data: {
            type: 'error',
            data: [message, ...optionalParams],
        },
    });
};

let handlerInstancesByMasterProcessInstanceId = {};

parentPort.on('message', async (message: { request: DesktopRunRequest<any>; service: any }) => {
    let handlerInstance = get(handlerInstancesByMasterProcessInstanceId, [
        message.request.rootProcessInstanceId,
        message.service.clazz,
    ]);

    try {
        if (!handlerInstance) {
            // const module = await import(`${message.service.dependency}/dist/${message.service.clazz}`);

            let modulePath = '';
            if (path.isAbsolute(message.service.dependency)) {
                modulePath = message.service.dependency + '/dist/' + message.service.clazz;
            } else {
                modulePath = message.service.dependency + '/' + message.service.clazz;
            }
            const module = await import(modulePath);
            const clazz = module.default as Type<any>;
            handlerInstance = new clazz();
            set(
                handlerInstancesByMasterProcessInstanceId,
                [message.request.rootProcessInstanceId, message.service.clazz],
                handlerInstance,
            );
        }
        const result = await handlerInstance.run(message.request);

        parentPort.postMessage({
            event: 'execution',
            data: {
                error: false,
                result: result,
            },
        });
    } catch (e) {
        parentPort.postMessage({
            event: 'execution',
            data: {
                error: true,
                result: e,
            },
        });
    } finally {
        if (handlerInstance && handlerInstance.getType() == 'StatelessActionHandler') {
            delete handlerInstancesByMasterProcessInstanceId[message.request.rootProcessInstanceId][
                message.service.clazz
            ];
            handlerInstance = null;
        }
    }
});
