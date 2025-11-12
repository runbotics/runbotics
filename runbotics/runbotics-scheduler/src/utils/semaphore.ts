export class Semaphore {
    private permits: number;
    private maxPermits: number;
    private waiting: Array<() => void> = [];

    constructor(maxPermits: number) {
        this.maxPermits = Math.max(1, maxPermits);
        this.permits = this.maxPermits;
    }

    async acquire(): Promise<void> {
        if (this.permits > 0) {
            this.permits--;
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            this.waiting.push(resolve);
        });
    }

    release(): void {
        if (this.waiting.length > 0) {
            const resolve = this.waiting.shift();
            resolve?.();
        } else {
            this.permits = Math.min(this.permits + 1, this.maxPermits);
        }
    }

    available(): number {
        return this.permits;
    }

    waitingCount(): number {
        return this.waiting.length;
    }

    setMaxPermits(maxPermits: number): void {
        const newMax = Math.max(1, maxPermits);
        const diff = newMax - this.maxPermits;
        
        if (diff > 0) {
            for (let i = 0; i < diff && this.waiting.length > 0; i++) {
                const resolve = this.waiting.shift();
                resolve?.();
            }
            this.permits = Math.min(this.permits + diff, newMax);
        } else if (diff < 0) {
            this.permits = Math.max(0, this.permits + diff);
        }
        
        this.maxPermits = newMax;
    }

    getMaxPermits(): number {
        return this.maxPermits;
    }
}
