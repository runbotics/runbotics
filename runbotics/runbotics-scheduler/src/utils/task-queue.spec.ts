import { describe, it, expect, beforeEach } from 'vitest';
import { TaskQueue } from './task-queue';

describe('TaskQueue', () => {
    let taskQueue: TaskQueue;

    beforeEach(() => {
        taskQueue = new TaskQueue(2);
    });

    describe('basic task execution', () => {
        it('should execute a single task', async () => {
            let executed = false;
            
            await taskQueue.enqueue(async () => {
                executed = true;
                return 'result';
            });
            
            expect(executed).toBe(true);
        });

        it('should return the task result', async () => {
            const result = await taskQueue.enqueue(async () => {
                return 'test-result';
            });
            
            expect(result).toBe('test-result');
        });

        it('should handle task errors', async () => {
            const errorMessage = 'Task failed';
            
            await expect(
                taskQueue.enqueue(async () => {
                    throw new Error(errorMessage);
                })
            ).rejects.toThrow(errorMessage);
        });
    });

    describe('parallelism control', () => {
        it('should limit concurrent execution to max parallelism', async () => {
            let concurrent = 0;
            let maxConcurrent = 0;
            
            const tasks = Array.from({ length: 5 }, () =>
                taskQueue.enqueue(async () => {
                    concurrent++;
                    maxConcurrent = Math.max(maxConcurrent, concurrent);
                    await new Promise(resolve => setTimeout(resolve, 50));
                    concurrent--;
                })
            );
            
            await Promise.all(tasks);
            
            expect(maxConcurrent).toBe(2);
            expect(concurrent).toBe(0);
        });

        it('should execute tasks in FIFO order', async () => {
            const executionOrder: number[] = [];
            
            const tasks = [0, 1, 2, 3, 4].map(i =>
                taskQueue.enqueue(async () => {
                    executionOrder.push(i);
                    await new Promise(resolve => setTimeout(resolve, 10));
                })
            );
            
            await Promise.all(tasks);
            
            expect(executionOrder).toEqual([0, 1, 2, 3, 4]);
        });

        it('should handle changing max parallelism', async () => {
            taskQueue.setMaxParallelism(3);
            
            let concurrent = 0;
            let maxConcurrent = 0;
            
            const tasks = Array.from({ length: 6 }, () =>
                taskQueue.enqueue(async () => {
                    concurrent++;
                    maxConcurrent = Math.max(maxConcurrent, concurrent);
                    await new Promise(resolve => setTimeout(resolve, 50));
                    concurrent--;
                })
            );
            
            await Promise.all(tasks);
            
            expect(maxConcurrent).toBe(3);
        });
    });

    describe('per-bot tracking', () => {
        it('should track tasks by bot ID', async () => {
            const bot1Task = taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return 'bot1';
            }, 'bot-1');
            
            const bot2Task = taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
                return 'bot2';
            }, 'bot-2');
            
            const stats = taskQueue.getStats();
            expect(stats.activeBots).toBeGreaterThan(0);
            
            await Promise.all([bot1Task, bot2Task]);
        });

        it('should wait for all tasks of a specific bot to complete', async () => {
            let task1Done = false;
            let task2Done = false;
            let task3Done = false;
            
            // Start tasks for bot-1
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                task1Done = true;
            }, 'bot-1');
            
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 150));
                task2Done = true;
            }, 'bot-1');
            
            // Start task for bot-2 (should not affect bot-1 wait)
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 200));
                task3Done = true;
            }, 'bot-2');
            
            await taskQueue.waitForCompletion('bot-1');
            
            expect(task1Done).toBe(true);
            expect(task2Done).toBe(true);
            expect(task3Done).toBe(false);
        });

        it('should resolve immediately if no tasks are active for bot', async () => {
            const startTime = Date.now();
            await taskQueue.waitForCompletion('non-existent-bot');
            const endTime = Date.now();
            
            expect(endTime - startTime).toBeLessThan(50);
        });

        it('should handle multiple waiters for the same bot', async () => {
            let taskDone = false;
            
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                taskDone = true;
            }, 'bot-1');
            
            const waiter1 = taskQueue.waitForCompletion('bot-1');
            const waiter2 = taskQueue.waitForCompletion('bot-1');
            const waiter3 = taskQueue.waitForCompletion('bot-1');
            
            await Promise.all([waiter1, waiter2, waiter3]);
            
            expect(taskDone).toBe(true);
        });
    });

    describe('global queue with per-bot fairness', () => {
        it('should process tasks globally in FIFO order regardless of bot', async () => {
            const executionOrder: string[] = [];
            
            const singleQueue = new TaskQueue(1);
            
            const tasks = [
                singleQueue.enqueue(async () => {
                    executionOrder.push('bot1-task1');
                }, 'bot-1'),
                singleQueue.enqueue(async () => {
                    executionOrder.push('bot2-task1');
                }, 'bot-2'),
                singleQueue.enqueue(async () => {
                    executionOrder.push('bot1-task2');
                }, 'bot-1'),
                singleQueue.enqueue(async () => {
                    executionOrder.push('bot3-task1');
                }, 'bot-3'),
            ];
            
            await Promise.all(tasks);
            
            expect(executionOrder).toEqual([
                'bot1-task1',
                'bot2-task1',
                'bot1-task2',
                'bot3-task1',
            ]);
        });

        it('should allow parallel execution across different bots', async () => {
            let bot1Running = false;
            let bot2Running = false;
            let bothRanSimultaneously = false;
            
            const task1 = taskQueue.enqueue(async () => {
                bot1Running = true;
                await new Promise(resolve => setTimeout(resolve, 100));
                if (bot2Running) {
                    bothRanSimultaneously = true;
                }
                bot1Running = false;
            }, 'bot-1');
            
            const task2 = taskQueue.enqueue(async () => {
                bot2Running = true;
                await new Promise(resolve => setTimeout(resolve, 100));
                if (bot1Running) {
                    bothRanSimultaneously = true;
                }
                bot2Running = false;
            }, 'bot-2');
            
            await Promise.all([task1, task2]);
            
            expect(bothRanSimultaneously).toBe(true);
        });
    });

    describe('queue statistics', () => {
        it('should provide accurate queue statistics', async () => {
            let stats = taskQueue.getStats();
            expect(stats.queueLength).toBe(0);
            expect(stats.availablePermits).toBe(2);
            
            const task1 = taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
            }, 'bot-1');
            
            const task2 = taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
            }, 'bot-2');
            
            const task3 = taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
            }, 'bot-3');
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            stats = taskQueue.getStats();
            expect(stats.activeBots).toBeGreaterThan(0);
            
            await Promise.all([task1, task2, task3]);
            
            stats = taskQueue.getStats();
            expect(stats.activeBots).toBe(0);
        });
    });

    describe('error handling', () => {
        it('should continue processing other tasks after one fails', async () => {
            let task1Done = false;
            let task3Done = false;
            
            const task1 = taskQueue.enqueue(async () => {
                task1Done = true;
            });
            
            const task2 = taskQueue.enqueue(async () => {
                throw new Error('Task 2 failed');
            });
            
            const task3 = taskQueue.enqueue(async () => {
                task3Done = true;
            });
            
            await task1;
            await expect(task2).rejects.toThrow('Task 2 failed');
            await task3;
            
            expect(task1Done).toBe(true);
            expect(task3Done).toBe(true);
        });

        it('should release semaphore permit even when task fails', async () => {
            const initialPermits = taskQueue.getStats().availablePermits;
            
            await expect(
                taskQueue.enqueue(async () => {
                    throw new Error('Task failed');
                })
            ).rejects.toThrow('Task failed');
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const finalPermits = taskQueue.getStats().availablePermits;
            expect(finalPermits).toBe(initialPermits);
        });

        it('should clean up bot tracking when task fails', async () => {
            await expect(
                taskQueue.enqueue(async () => {
                    throw new Error('Bot task failed');
                }, 'bot-1')
            ).rejects.toThrow('Bot task failed');
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const stats = taskQueue.getStats();
            expect(stats.activeBots).toBe(0);
        });
    });

    describe('concurrent operations', () => {
        it('should handle rapid task enqueueing', async () => {
            const taskCount = 100;
            let completedCount = 0;
            
            const tasks = Array.from({ length: taskCount }, (_, i) =>
                taskQueue.enqueue(async () => {
                    completedCount++;
                    return i;
                })
            );
            
            const results = await Promise.all(tasks);
            
            expect(completedCount).toBe(taskCount);
            expect(results).toHaveLength(taskCount);
        });

        it('should handle interleaved enqueue and waitForCompletion calls', async () => {
            let tasksCompleted = 0;
            
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
                tasksCompleted++;
            }, 'bot-1');
            
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                tasksCompleted++;
            }, 'bot-1');
            
            const waitPromise = taskQueue.waitForCompletion('bot-1');
            
            taskQueue.enqueue(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
                tasksCompleted++;
            }, 'bot-2');
            
            await waitPromise;
            
            expect(tasksCompleted).toBe(2);
        });
    });
});
