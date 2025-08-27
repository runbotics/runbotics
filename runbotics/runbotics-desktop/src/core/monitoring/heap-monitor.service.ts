import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { RunboticsLogger } from '#logger';
import * as v8 from 'v8';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

interface HeapStats {
    total_heap_size: number;
    total_heap_size_executable: number;
    total_physical_size: number;
    total_available_size: number;
    used_heap_size: number;
    heap_size_limit: number;
    malloced_memory: number;
    peak_malloced_memory: number;
    does_zap_garbage: number;
    number_of_native_contexts: number;
    number_of_detached_contexts: number;
    total_global_handles_size: number;
    used_global_handles_size: number;
    external_memory: number;
}

interface MemoryStats {
    totalMemory: number;
    freeMemory: number;
    usedMemory: number;
    usagePercent: number;
}

@Injectable()
export class HeapMonitorService implements OnApplicationBootstrap, OnModuleDestroy {
    private readonly logger = new RunboticsLogger(HeapMonitorService.name);
    private monitoringIntervalHandle: ReturnType<typeof setInterval> | null = null;
    private readonly DEFAULT_MONITORING_INTERVAL_MS = 60000;
    private readonly DEFAULT_HEAP_DUMP_THRESHOLD_BYTES = 2 * 1024 * 1024 * 1024;
    private readonly DEFAULT_HEAP_DUMP_INTERVAL_MS = 300000;
    private lastHeapDumpTime = 0;

    onApplicationBootstrap() {
        this.logger.log('Heap monitoring service started');
        this.logInitialStats();
        this.logHeapDumpConfiguration();

        if (os.platform() === 'win32') {
            const intervalMs = this.getMonitoringInterval();
            this.startPeriodicMonitoring(intervalMs);
        } else {
            this.logger.log('Periodic heap monitoring is disabled on non-Windows platforms');
        }
    }

    onModuleDestroy() {
        this.stopPeriodicMonitoring();
        this.logger.log('Heap monitoring service stopped');
    }

    private logInitialStats(): void {
        this.logger.log('=== Initial Heap & Memory Statistics ===');
        this.logCurrentHeapStats();
    }

    private logHeapDumpConfiguration(): void {
        const heapDumpEnabled = process.env.RUNBOTICS_ENABLE_HEAP_DUMPS;
        const heapDumpPath = process.env.RUNBOTICS_HEAP_DUMP_PATH;

        if (heapDumpEnabled && heapDumpEnabled.toLowerCase() === 'true') {
            const thresholdBytes = this.getHeapDumpThreshold();
            const intervalMs = this.getHeapDumpInterval();
            this.logger.log(`Automatic heap dumps ENABLED - Threshold: ${(thresholdBytes / (1024 * 1024 * 1024)).toFixed(2)} GB (${thresholdBytes} bytes), Min interval: ${intervalMs / 1000} seconds`);
            this.logger.log(`Heap dump directory: ${heapDumpPath || path.join(process.cwd(), 'heap-dumps')}`);
        } else {
            this.logger.log('Automatic heap dumps DISABLED. Set RUNBOTICS_ENABLE_HEAP_DUMPS=true to enable.');
        }
    }

    private startPeriodicMonitoring(intervalMs: number): void {
        this.logger.log(`Starting periodic heap and memory monitoring every ${intervalMs / 1000} seconds`);

        if (this.monitoringIntervalHandle) {
            clearInterval(this.monitoringIntervalHandle);
            this.monitoringIntervalHandle = null;
        }

        this.monitoringIntervalHandle = setInterval(() => {
            this.logCurrentHeapStats();
        }, intervalMs);
    }

    private stopPeriodicMonitoring(): void {
        if (this.monitoringIntervalHandle !== null) {
            clearInterval(this.monitoringIntervalHandle);
            this.monitoringIntervalHandle = null;
            this.logger.log('Periodic heap monitoring stopped');
        }
    }

    private getMonitoringInterval(): number {
        const envInterval = process.env.RUNBOTICS_HEAP_MONITOR_INTERVAL_MS;
        if (envInterval && !isNaN(parseInt(envInterval))) {
            return parseInt(envInterval);
        }
        return this.DEFAULT_MONITORING_INTERVAL_MS;
    }

    private getHeapDumpThreshold(): number {
        const envThreshold = process.env.RUNBOTICS_HEAP_DUMP_THRESHOLD_BYTES;
        if (envThreshold && !isNaN(parseInt(envThreshold))) {
            return parseInt(envThreshold);
        }
        return this.DEFAULT_HEAP_DUMP_THRESHOLD_BYTES;
    }

    private getHeapDumpInterval(): number {
        const envInterval = process.env.RUNBOTICS_HEAP_DUMP_INTERVAL_MS;
        if (envInterval && !isNaN(parseInt(envInterval))) {
            return parseInt(envInterval);
        }
        return this.DEFAULT_HEAP_DUMP_INTERVAL_MS;
    }

    private logCurrentHeapStats(): void {
        try {
            const heapStats = v8.getHeapStatistics() as HeapStats;
            const heapSpaceStats = v8.getHeapSpaceStatistics();

            const formattedStats = {
                totalHeapSize: this.formatBytes(heapStats.total_heap_size),
                usedHeapSize: this.formatBytes(heapStats.used_heap_size),
                availableHeapSize: this.formatBytes(heapStats.total_available_size),
                heapSizeLimit: this.formatBytes(heapStats.heap_size_limit),
                externalMemory: this.formatBytes(heapStats.external_memory),
                mallocedMemory: this.formatBytes(heapStats.malloced_memory),
                peakMallocedMemory: this.formatBytes(heapStats.peak_malloced_memory),
                numberOfNativeContexts: heapStats.number_of_native_contexts,
                numberOfDetachedContexts: heapStats.number_of_detached_contexts,
                totalGlobalHandlesSize: this.formatBytes(heapStats.total_global_handles_size),
                usedGlobalHandlesSize: this.formatBytes(heapStats.used_global_handles_size),
                heapUsagePercent: ((heapStats.used_heap_size / heapStats.total_heap_size) * 100).toFixed(2)
            };

            this.logger.log(`Heap Statistics: ${JSON.stringify(formattedStats, null, 2)}`);

            const formattedSpaceStats = heapSpaceStats
                .filter(space => space.space_used_size > 1024 * 1024 * 1024) // Show only meaningful spaces
                .map(space => ({
                    spaceName: space.space_name,
                    spaceSize: this.formatBytes(space.space_size),
                    spaceUsedSize: this.formatBytes(space.space_used_size),
                    spaceAvailableSize: this.formatBytes(space.space_available_size),
                    physicalSpaceSize: this.formatBytes(space.physical_space_size),
                    usagePercent: space.space_size > 0 ?
                        ((space.space_used_size / space.space_size) * 100).toFixed(2) : '0.00'
                }));

            this.logger.log(`Heap Space Statistics: ${JSON.stringify(formattedSpaceStats, null, 2)}`);

            this.logMemoryStats();

            this.checkAndCreatePeriodicHeapDump(heapStats);

            const usagePercent = (heapStats.used_heap_size / heapStats.heap_size_limit) * 100;
            if (usagePercent > 80) {
                this.logger.warn(`High memory usage detected: ${usagePercent.toFixed(2)}% of heap limit`);
            } else if (usagePercent > 90) {
                this.logger.error(`Critical memory usage detected: ${usagePercent.toFixed(2)}% of heap limit`);
            }

        } catch (error) {
            this.logger.error('Failed to retrieve heap statistics', error);
        }
    }

    private formatBytes(bytes: number): string {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB (${bytes.toLocaleString()} bytes)`;
    }

    private getMemoryStats(): MemoryStats {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const usagePercent = (usedMemory / totalMemory) * 100;

        return {
            totalMemory,
            freeMemory,
            usedMemory,
            usagePercent
        };
    }

    private logMemoryStats(): void {
        try {
            const memStats = this.getMemoryStats();

            const formattedMemStats = {
                totalMemory: this.formatBytes(memStats.totalMemory),
                usedMemory: this.formatBytes(memStats.usedMemory),
                freeMemory: this.formatBytes(memStats.freeMemory),
                usagePercent: memStats.usagePercent.toFixed(2)
            };

            this.logger.log(`System Memory Statistics: ${JSON.stringify(formattedMemStats, null, 2)}`);

            if (memStats.usagePercent > 85) {
                this.logger.warn(`High system memory usage detected: ${memStats.usagePercent.toFixed(2)}%`);
            } else if (memStats.usagePercent > 95) {
                this.logger.error(`Critical system memory usage detected: ${memStats.usagePercent.toFixed(2)}%`);
            }

        } catch (error) {
            this.logger.error('Failed to retrieve memory statistics', error);
        }
    }

    private checkAndCreatePeriodicHeapDump(heapStats: HeapStats): void {
        const heapDumpEnabled = process.env.RUNBOTICS_ENABLE_HEAP_DUMPS;
        if (!heapDumpEnabled || heapDumpEnabled.toLowerCase() !== 'true') {
            return;
        }

        const currentTime = Date.now();
        const heapThresholdBytes = this.getHeapDumpThreshold();
        const heapDumpInterval = this.getHeapDumpInterval();
        const heapUsageGB = heapStats.used_heap_size / (1024 * 1024 * 1024);

        if (heapStats.used_heap_size > heapThresholdBytes &&
            (currentTime - this.lastHeapDumpTime) > heapDumpInterval) {

            this.logger.warn(`Heap usage (${heapUsageGB.toFixed(2)} GB) exceeds threshold (${(heapThresholdBytes / (1024 * 1024 * 1024)).toFixed(2)} GB). Creating heap dump...`);

            try {
                const dumpPath = this.createHeapDumpWithSuffix('auto-high-usage');
                this.lastHeapDumpTime = currentTime;
                this.logger.log(`Automatic heap dump created: ${dumpPath}`);
            } catch (error) {
                this.logger.error('Failed to create automatic heap dump', error);
            }
        }
    }

    public logHeapStatsNow(): void {
        this.logger.log('=== Manual Heap & Memory Statistics Trigger ===');
        this.logCurrentHeapStats();
    }

    public getCurrentHeapStats(): HeapStats {
        return v8.getHeapStatistics() as HeapStats;
    }

    public getCurrentMemoryStats(): MemoryStats {
        return this.getMemoryStats();
    }

    public checkHeapDumpCondition(): boolean {
        const heapStats = this.getCurrentHeapStats();
        const heapThresholdBytes = this.getHeapDumpThreshold();
        const heapUsageGB = heapStats.used_heap_size / (1024 * 1024 * 1024);
        const enabled = process.env.RUNBOTICS_ENABLE_HEAP_DUMPS?.toLowerCase() === 'true';

        this.logger.log(`Heap dump check - Enabled: ${enabled}, Usage: ${heapUsageGB.toFixed(2)} GB, Threshold: ${(heapThresholdBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`);

        if (enabled && heapStats.used_heap_size > heapThresholdBytes) {
            this.checkAndCreatePeriodicHeapDump(heapStats);
            return true;
        }
        return false;
    }

    public forceGarbageCollectionAndLog(): void {
        if (global.gc) {
            this.logger.log('=== Before Garbage Collection ===');
            this.logCurrentHeapStats();

            global.gc();

            this.logger.log('=== After Garbage Collection ===');
            this.logCurrentHeapStats();
        } else {
            this.logger.warn('Garbage collection not available. Start Node.js with --expose-gc flag to enable this feature.');
        }
    }

    public createHeapDump(): string {
        try {
            this.forceGarbageCollectionAndLog();
            this.logger.log('=== Starting Heap Dump Creation ===');
            this.logCurrentHeapStats();

            const dumpDirectory = this.getHeapDumpDirectory();
            const filename = this.generateHeapDumpFilename();
            const fullPath = path.join(dumpDirectory, filename);
            this.ensureDirectoryExists(dumpDirectory);

            this.logger.log(`Creating heap dump: ${fullPath}`);

            v8.writeHeapSnapshot(fullPath);

            const stats = fs.statSync(fullPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            this.logger.log('=== Heap Dump Created Successfully ===');
            this.logger.log(`File: ${fullPath}`);
            this.logger.log(`Size: ${fileSizeMB} MB`);
            this.logCurrentHeapStats();

            return fullPath;
        } catch (error) {
            this.logger.error('Failed to create heap dump', error);
            throw error;
        }
    }

    public createHeapDumpWithSuffix(suffix: string): string {
        try {
            this.logger.log(`=== Starting Heap Dump Creation (${suffix}) ===`);
            this.logCurrentHeapStats();

            const dumpDirectory = this.getHeapDumpDirectory();
            const filename = this.generateHeapDumpFilename(suffix);
            const fullPath = path.join(dumpDirectory, filename);

            this.ensureDirectoryExists(dumpDirectory);

            this.logger.log(`Creating heap dump with suffix '${suffix}': ${fullPath}`);

            v8.writeHeapSnapshot(fullPath);

            const stats = fs.statSync(fullPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            this.logger.log('=== Heap Dump Created Successfully ===');
            this.logger.log(`File: ${fullPath}`);
            this.logger.log(`Size: ${fileSizeMB} MB`);
            this.logCurrentHeapStats();

            return fullPath;
        } catch (error) {
            this.logger.error(`Failed to create heap dump with suffix '${suffix}'`, error);
            throw error;
        }
    }

    private getHeapDumpDirectory(): string {
        const envPath = process.env.RUNBOTICS_HEAP_DUMP_PATH;
        if (envPath) {
            return envPath;
        }

        return path.join(process.cwd(), 'heap-dumps');
    }

    private generateHeapDumpFilename(suffix?: string): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const dateStr = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        const suffixStr = suffix ? `_${suffix}` : '';

        return `runbotics-heap-dump_${dateStr}${suffixStr}.heapsnapshot`;
    }

    private ensureDirectoryExists(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            this.logger.log(`Creating heap dump directory: ${dirPath}`);
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
}
