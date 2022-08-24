import path from 'path';
import { Worker } from 'worker_threads';

export const createExternalActionWorker2 = () => {
    // @ts-ignore
    console.log('process.resourcesPath', process.resourcesPath);
    const scriptPath =
        process.env.NODE_ENV == 'development'
            ? path.join(__dirname, './ExternalActionsWorker.js')
            // @ts-ignore
            : path.join(process.resourcesPath, 'app.asar.unpacked/build/ExternalActionsWorker.js');
    console.log("scriptPath')", scriptPath);

    return new Worker(scriptPath);
};

// THIS STRING IS COMPILED ExternalActionsWorker.ts, its done dthat way cuz of electron
export const createExternalActionWorker = () => {
    return new Worker(
        `
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const path_1 = __importDefault(require("path"));
console.log = function (message, ...optionalParams) {
    worker_threads_1.parentPort.postMessage({
        event: 'log',
        data: {
            type: 'info',
            data: [
                message,
                ...optionalParams,
            ],
        },
    });
};
console.info = function (message, ...optionalParams) {
    worker_threads_1.parentPort.postMessage({
        event: 'log',
        data: {
            type: 'info',
            data: [
                message,
                ...optionalParams,
            ],
        },
    });
};
console.error = function (message, ...optionalParams) {
    worker_threads_1.parentPort.postMessage({
        event: 'log',
        data: {
            type: 'error',
            data: [
                message,
                ...optionalParams,
            ],
        },
    });
};
let handlerInstancesByMasterProcessInstanceId = {};
worker_threads_1.parentPort.on('message', async (message) => {
    let handlerInstance = get_1.default(handlerInstancesByMasterProcessInstanceId, [message.request.rootProcessInstanceId, message.service.clazz]);
    try {
        if (!handlerInstance) {
            let modulePath = "";
            if (path_1.default.isAbsolute(message.service.dependency)) {
                modulePath = message.service.dependency + "/dist/" + message.service.clazz;
            }
            else {
                modulePath = message.service.dependency + "/" + message.service.clazz;
            }
            const module = await Promise.resolve().then(() => __importStar(require(modulePath)));
            const clazz = module.default;
            handlerInstance = new clazz();
            set_1.default(handlerInstancesByMasterProcessInstanceId, [message.request.rootProcessInstanceId, message.service.clazz], handlerInstance);
        }
        const result = await handlerInstance.run(message.request);
        worker_threads_1.parentPort.postMessage({
            event: 'execution',
            data: {
                error: false,
                result: result,
            },
        });
    }
    catch (e) {
        worker_threads_1.parentPort.postMessage({
            event: 'execution',
            data: {
                error: true,
                result: e,
            },
        });
    }
    finally {
        if (handlerInstance && handlerInstance.getType() == 'StatelessActionHandler') {
            delete handlerInstancesByMasterProcessInstanceId[message.request.rootProcessInstanceId][message.service.clazz];
            handlerInstance = null;
        }
    }
});
//# sourceMappingURL=ExternalActionsWorker.js.map
`,
        {
            eval: true,
        },
    );
};
