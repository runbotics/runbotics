import { Worker } from 'worker_threads';
import { DesktopRunRequest } from "../handler";
import { WorkerMessageType } from "./Multithread.types";
import { MultithreadStatelessActionHandler } from './MultithreadStatelessActionHandler';

export class MultithreadStatelessRunner extends MultithreadStatelessActionHandler {
    private worker = null;

    constructor(handlerPath: string) {
        super();
        this.startWorker(handlerPath);
    }

    run(request: DesktopRunRequest<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            const stringRequest = JSON.stringify(request)
            this.worker.postMessage({ type: WorkerMessageType.RUN, stringRequest });
            this.onMessage(resolve, reject);
        });
    }

    private async startWorker(handlerPath) {
        this.worker = new Worker('./Worker.js', { workerData: { handlerPath } });
    }

    private async onMessage(resolve, reject, callback?: () => void) {
        if (callback) callback();
        this.worker.on('message', (result) => {
            resolve(result);
        });
        this.worker.on('error', (error) => {
            reject(error);
        });
    }
}