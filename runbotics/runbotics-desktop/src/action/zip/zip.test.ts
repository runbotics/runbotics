import { Test } from '@nestjs/testing';
import fs from 'fs';
import path from 'path';
import ZipActionHandler from './zip.action-handler';
import { ServerConfigService } from '../../config';
import { ZipFileActionInput } from './zip.types';

describe('FolderActionHandler', () => {
    let zipActionHandler: ZipActionHandler;
    let serverConfigService: ServerConfigService;

    const TEST_FOLDER_NAME = 'temp';
    const TEMP_FOLDER_PATH = `${process.cwd()}${path.sep}temp`;
    const CWD = `${process.cwd()}`;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ZipActionHandler, 
                ServerConfigService
            ],
        })
            .overrideProvider(ServerConfigService)
            .useValue({
                tempFolderPath: TEMP_FOLDER_PATH,
            })
            .compile();
        zipActionHandler = module.get(ZipActionHandler);
        serverConfigService = module.get(ServerConfigService);
    });

    beforeEach(async () => {
        if (!fs.existsSync(TEMP_FOLDER_PATH)) {
            fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
        }
    });

    afterEach(async () => {
        if (fs.existsSync(TEMP_FOLDER_PATH)) {
            fs.rmSync(TEMP_FOLDER_PATH, { recursive: true });
        }

        if (fs.existsSync(`${TEMP_FOLDER_PATH}.zip`)) {
            fs.rmSync(`${TEMP_FOLDER_PATH}.zip`, { recursive: true });
        }
    });

    afterAll(async () => {
        if (fs.existsSync(serverConfigService.tempFolderPath)) {
            fs.rmSync(serverConfigService.tempFolderPath);
        }
    });

    it('should be defined', () => {
        expect(zipActionHandler).toBeDefined();
        expect(serverConfigService).toBeDefined();
    });

    describe('Create archive', async() => {
        it('Should create zip folder when fileName is not provided', async() => {
            console.log('TEMP_FOLDER_PATH', TEMP_FOLDER_PATH);
            const params: ZipFileActionInput = {
                fileName: undefined,
                path: TEMP_FOLDER_PATH
            };

            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}.zip`)
            ).toBeTruthy();
        });

        it('Should create zip folder when all parameters are provided', async() => {
            const params: ZipFileActionInput = {
                fileName: TEST_FOLDER_NAME,
                path: TEMP_FOLDER_PATH
            };

            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}.zip`)
            ).toBeTruthy();
        });

        it('Should throw error when path is not provided', async() => {
            const params: ZipFileActionInput = {
                fileName: TEST_FOLDER_NAME,
                path: undefined
            };

            await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
                'Path to a folder is mandatory'
            );
        });

        it('Should throw error when zip file already exists', async() => {
            const params: ZipFileActionInput = {
                fileName: undefined,
                path: TEMP_FOLDER_PATH
            };

            await zipActionHandler.zipFile(params);
            await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
                'Zip file with this name already exists'
            );
        });
    });
});