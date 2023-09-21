const { parentPort, workerData } = require('worker_threads');
import { WorkerMessage, WorkerMessageType } from "./Multithread.types";
import { DesktopRunRequest } from "../handler/DesktopRunRequest";
import { error } from "console";

if (workerData && workerData.handlerPath) {
    console.log('[Worker] dynamic import of handler: ', workerData.handlerPath);
    console.log('[Worker] path: ', process.cwd());
    import(workerData.handlerPath)
        .then(async function (module) {
            const handler = module.default;
            const handlerInstance = new handler();

            await parentPort.on('message', (params: WorkerMessage) => {
                console.log('[Worker] on message: ', params);
                if (params.type === WorkerMessageType.EXIT) {
                    return handlerInstance.tearDown()
                        .then(() => process.exit(0));
                } else {
                    const request: DesktopRunRequest = JSON.parse(params.stringRequest);
                    handlerInstance
                        .run(request)
                        .then((result) => parentPort.postMessage(result))
                        .catch((error) => parentPort.postMessage(error));
                }
            })
        })
        .catch((e) => {
            console.log('[Worker] error: ', e);
            throw new error(e);
            // process.exit(1);
        })
}