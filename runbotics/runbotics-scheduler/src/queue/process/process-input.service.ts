import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';
import { InstantProcess, IProcess, ProcessInput } from 'runbotics-common';
import { Logger } from 'src/utils/logger';
import { ProcessFileService } from './process-file.service';

@Injectable()
export class ProcessInputService {
    private readonly logger = new Logger(ProcessInputService.name);

    constructor(
        @Inject(ProcessFileService) private readonly processFileService: ProcessFileService,
    ) {
    }

    public mergeInputVariables(instantProcess: InstantProcess, fileVariables: unknown): InstantProcess {
        const variables = instantProcess.input.variables;

        Object.entries(fileVariables).forEach(([ path, value ]) => {
            _.set(variables, path, value);
        });

        const input = { variables };

        return { ...instantProcess, input };
    }

    public async uploadAttendedFiles(
        process: IProcess,
        input: ProcessInput,
        orchestratorProcessInstanceId: string,
    ): Promise<unknown> {
        if (!process.isAttended || process.schedules?.length > 0)
            return Promise.resolve({});

        const uiSchema = JSON.parse(process.executionInfo).uiSchema;
        const fileKeys = this.processFileService.getFileSchemaKeys(uiSchema);

        if (fileKeys.length <= 0)
            return Promise.resolve({});

        const fileVariables = {};

        for (const key of fileKeys) {
            const file = _.get(input.variables, key);
            if (!file) continue;
            const uploadedFilePath = await this.processFileService.uploadFile(file, orchestratorProcessInstanceId)
                .catch(err => {
                    this.logger.error('Failed to upload process file -', err);
                    throw new InternalServerErrorException('Failed to upload file to OneDrive', err.message);
                });
            this.logger.log(`Uploaded file "${key}" to ${uploadedFilePath}`);
            fileVariables[key] = uploadedFilePath;
        }

        return Promise.resolve(fileVariables);
    }
}
