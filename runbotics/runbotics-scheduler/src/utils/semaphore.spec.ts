import { describe, it, expect, beforeEach } from 'vitest';
import { Semaphore } from './semaphore';

describe('Semaphore', () => {
    let semaphore: Semaphore;

    beforeEach(() => {
        semaphore = new Semaphore(2);
    });

    describe('basic acquire/release', () => {
        it('should allow acquiring up to max permits', async () => {
            await semaphore.acquire();
            await semaphore.acquire();
            
            expect(semaphore.available()).toBe(0);
            expect(semaphore.waitingCount()).toBe(0);
        });

        it('should queue when permits exhausted', async () => {
            await semaphore.acquire();
            await semaphore.acquire();
            
            const acquirePromise = semaphore.acquire();
            
            expect(semaphore.available()).toBe(0);
            expect(semaphore.waitingCount()).toBe(1);
            
            semaphore.release();
            await acquirePromise;
            
            expect(semaphore.available()).toBe(0);
            expect(semaphore.waitingCount()).toBe(0);
        });

        it('should release permits back when not waiting', () => {
            semaphore.release();
            
            expect(semaphore.available()).toBe(2);
        });

        it('should not exceed max permits on release', () => {
            semaphore.release();
            semaphore.release();
            semaphore.release();
            
            expect(semaphore.available()).toBe(2);
        });
    });

    describe('concurrent operations', () => {
        it('should handle multiple acquisitions in order', async () => {
            const semaphore = new Semaphore(1);
            const results: number[] = [];
            
            const task = async (id: number) => {
                await semaphore.acquire();
                results.push(id);
                await new Promise(resolve => setTimeout(resolve, 10));
                semaphore.release();
            };
            
            await Promise.all([task(1), task(2), task(3)]);
            
            expect(results).toHaveLength(3);
            expect(results).toEqual([1, 2, 3]);
        });

        it('should allow parallel execution up to limit', async () => {
            const semaphore = new Semaphore(3);
            let concurrent = 0;
            let maxConcurrent = 0;
            
            const task = async () => {
                await semaphore.acquire();
                concurrent++;
                maxConcurrent = Math.max(maxConcurrent, concurrent);
                await new Promise(resolve => setTimeout(resolve, 20));
                concurrent--;
                semaphore.release();
            };
            
            await Promise.all([task(), task(), task(), task(), task()]);
            
            expect(maxConcurrent).toBe(3);
            expect(concurrent).toBe(0);
        });
    });

    describe('dynamic permit changes', () => {
        it('should increase permits and wake waiting tasks', async () => {
            await semaphore.acquire();
            await semaphore.acquire();
            
            const promise1 = semaphore.acquire();
            const promise2 = semaphore.acquire();
            
            expect(semaphore.waitingCount()).toBe(2);
            
            semaphore.setMaxPermits(4);
            
            await promise1;
            await promise2;
            
            expect(semaphore.waitingCount()).toBe(0);
            expect(semaphore.getMaxPermits()).toBe(4);
        });

        it('should decrease permits', () => {
            semaphore.setMaxPermits(1);
            
            expect(semaphore.getMaxPermits()).toBe(1);
            expect(semaphore.available()).toBe(1);
        });

        it('should enforce minimum of 1 permit', () => {
            semaphore.setMaxPermits(0);
            expect(semaphore.getMaxPermits()).toBe(1);
            
            semaphore.setMaxPermits(-5);
            expect(semaphore.getMaxPermits()).toBe(1);
        });
    });

    describe('edge cases', () => {
        it('should handle initialization with invalid permits', () => {
            const sem1 = new Semaphore(0);
            expect(sem1.getMaxPermits()).toBe(1);
            
            const sem2 = new Semaphore(-10);
            expect(sem2.getMaxPermits()).toBe(1);
        });

        it('should handle rapid acquire/release cycles', async () => {
            const semaphore = new Semaphore(1);
            
            for (let i = 0; i < 100; i++) {
                await semaphore.acquire();
                semaphore.release();
            }
            
            expect(semaphore.available()).toBe(1);
            expect(semaphore.waitingCount()).toBe(0);
        });
    });
});
