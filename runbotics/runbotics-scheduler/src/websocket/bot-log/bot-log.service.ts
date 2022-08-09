import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { EOL } from 'os';
import dayjs from 'dayjs';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { Logger } from 'src/utils/logger';
import * as rd from 'readline';

@Injectable()
export class BotLogService {
    private readonly DATE_FORMAT = 'YYYY_MM_DD_HH';
    private readonly logger = new Logger(BotLogService.name);

    constructor(private serverConfigService: ServerConfigService) {}

    writeLogsToFile(id: number, log: string) {
        const { path, file } = this.getFileInfo(id);
        
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) throw err;
        });

        const data = this.readExistingFile(file);
        const fd = fs.openSync(file, 'w+');
        const buffer = Buffer.from(log);

        fs.writeSync(fd, buffer, 0, buffer.length, 0);
        if (data) {
            fs.writeSync(fd, data, 0, data.length, buffer.length);
        }
        fs.close(fd);
    }

    async getLogs(id: number, lines: number) {
        const { file } = this.getFileInfo(id);

        if (!fs.existsSync(file)) {
            this.logger.error(`File ${file} does not exist`);
            return 'ERROR';
        }

        const fileStream = fs.createReadStream(file);

        const rl = rd.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let content = '';
        let readLines = 0;

        for await (const line of rl) {
            content += line;
            readLines++;
            if (lines === readLines) {
                break;
            } else {
                content += EOL;
            }
        }

        this.logger.log(`Read ${lines} lines from ${file}`);
        
        const result = content.split('\r\n');
        return result;
    }

    private getFileInfo(id: number) {
        const path = this.serverConfigService.botLogsDirectoryPath || './';
        const file = `${path}/${dayjs().format(this.DATE_FORMAT)}_${id}.log`;
        return { path, file };
    }

    private readExistingFile(file: string): Buffer {
        try {
            if (fs.existsSync(file)) {
                return fs.readFileSync(file);
            }
        } catch(err) {
            this.logger.error(`File ${file} does not exist: creating new one`, err);
            return Buffer.from('');
        }
    }

}
