import { Semaphore } from './semaphore';

interface Task<T> {
    id: string;
    botId?: string;
    execute: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
}

export class TaskQueue {
    private semaphore: Semaphore;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private queue: Task<any>[] = [];
    private processing = false;
    private taskCounter = 0;
    private activeTasks = new Map<string, number>();
    private completionCallbacks = new Map<string, Array<() => void>>();

    constructor(maxParallelism: number) {
        this.semaphore = new Semaphore(maxParallelism);
    }

    enqueue<T>(task: () => Promise<T>, botId?: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const taskId = `task-${++this.taskCounter}`;
            
            this.queue.push({
                id: taskId,
                botId,
                execute: task,
                resolve,
                reject,
            });

            if (botId) {
                const currentCount = this.activeTasks.get(botId) || 0;
                this.activeTasks.set(botId, currentCount + 1);
            }

            this.processQueue();
        });
    }

    async waitForCompletion(botId: string): Promise<void> {
        const taskCount = this.activeTasks.get(botId);
        if (!taskCount || taskCount === 0) {
            return;
        }
        
        return new Promise<void>((resolve) => {
            if (!this.completionCallbacks.has(botId)) {
                this.completionCallbacks.set(botId, []);
            }
            const callbacks = this.completionCallbacks.get(botId);
            if (callbacks) {
                callbacks.push(resolve);
            }
        });
    }

    setMaxParallelism(maxParallelism: number): void {
        this.semaphore.setMaxPermits(maxParallelism);
        this.processQueue();
    }

    getStats() {
        return {
            queueLength: this.queue.length,
            availablePermits: this.semaphore.available(),
            waitingForPermits: this.semaphore.waitingCount(),
            activeBots: this.activeTasks.size,
        };
    }

    private async processQueue(): Promise<void> {
        if (this.processing) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            
            if (!task) {
                break;
            }
            
            await this.semaphore.acquire();
            
            this.executeTask(task);
        }

        this.processing = false;
    }

    private async executeTask<T>(task: Task<T>): Promise<void> {
        try {
            const result = await task.execute();
            task.resolve(result);
        } catch (error) {
            task.reject(error);
        } finally {
            if (task.botId) {
                const currentCount = this.activeTasks.get(task.botId) || 0;
                const newCount = currentCount - 1;
                
                if (newCount <= 0) {
                    this.activeTasks.delete(task.botId);
                    this.notifyBotCompletion(task.botId);
                } else {
                    this.activeTasks.set(task.botId, newCount);
                }
            }
            
            this.semaphore.release();
        }
    }

    private notifyBotCompletion(botId: string): void {
        const callbacks = this.completionCallbacks.get(botId);
        if (callbacks) {
            callbacks.forEach(callback => callback());
            this.completionCallbacks.delete(botId);
        }
    }
}
