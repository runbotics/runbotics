import { parentPort, workerData } from "worker_threads";
import { WorkerMessage, WorkerMessageType } from "./Multithread.types";
import { DesktopRunRequest } from "../handler/DesktopRunRequest";

if (!workerData || !workerData.handlerPath) {
    import(workerData.handlerPath)
        .then(async (module) => {
            const handler = module.default;
            const handlerInstance = new handler();

            await parentPort.on('message', (params: WorkerMessage) => {
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
}