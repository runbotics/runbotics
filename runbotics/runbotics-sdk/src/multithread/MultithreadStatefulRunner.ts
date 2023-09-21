const { Worker } = require('worker_threads');
import path from "path";
import { DesktopRunRequest } from "../handler";
import { WorkerMessageType } from "./Multithread.types";
import { MultithreadStatefulActionHandler } from './MultithreadStatefulActionHandler';

export class MultithreadStatefulRunner extends MultithreadStatefulActionHandler {
    private worker = null;

    constructor(handlerPath: string) {
        super();
        this.startWorker(handlerPath);
    }

    async tearDown(): Promise<void> {
        await this.worker.postMessage({ type: WorkerMessageType.EXIT });
    }

    run(request: DesktopRunRequest<string, any>): Promise<any> {
        console.log('[MultithreadStatefulRunner] run request: ', request);
        return new Promise((resolve, reject) => {
            const stringRequest = JSON.stringify(request)
            this.worker.postMessage({ type: WorkerMessageType.RUN, stringRequest });
            this.onMessage(resolve, reject);
        });
    }

    private async startWorker(handlerPath) {
        console.log('[MultithreadStatefulRunner] startWorker');
        this.worker = new Worker(path.resolve('./node_modules/@runbotics/runbotics-sdk/dist/Worker.js'), { workerData: { handlerPath } });
    }

    private async onMessage(resolve, reject) {
        this.worker.on('message', (result) => {
            resolve(result);
        });
        this.worker.on('error', (error) => {
            reject(error);
        });
        this.worker.on('unhandledRejection', (error) => {
            console.error('Unhandled Promise Rejection:', error);
            console.error('Terminating worker...');
            this.worker.terminate();
        });
    }
}