import { Test } from '@nestjs/testing';
import fs from 'fs';
import path from 'path';
import ZipActionHandler from './zip.action-handler';
import { ServerConfigService } from '../../config';
import { UnzipFileActionInput, ZipFileActionInput } from './zip.types';

describe('FolderActionHandler', () => {
    let zipActionHandler: ZipActionHandler;
    let serverConfigService: ServerConfigService;

    const TEST_FOLDER_NAME = 'temp';
    const TEMP_FOLDER_PATH = `${process.cwd()}${path.sep}temp`;
    const FOLDER_TO_UNZIP_NAME = 'unzipThis';
    const ZIP_TESTING_FOLDER = `${TEMP_FOLDER_PATH}${path.sep}${FOLDER_TO_UNZIP_NAME}`;

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

        if (fs.existsSync(`${ZIP_TESTING_FOLDER}.zip`)) {
            fs.rmSync(`${ZIP_TESTING_FOLDER}.zip`);
        }
    });

    afterEach(async () => {
        if (fs.existsSync(ZIP_TESTING_FOLDER)) {
            fs.rmSync(ZIP_TESTING_FOLDER, { recursive: true });
        }

        if (fs.existsSync(`${TEMP_FOLDER_PATH}.zip`)) {
            fs.rmSync(`${TEMP_FOLDER_PATH}.zip`, { recursive: true });
        }

    });

    afterAll(async () => {
        if (fs.existsSync(serverConfigService.tempFolderPath)) {
            fs.rmdirSync(serverConfigService.tempFolderPath, { recursive: true });
        }

        if (fs.existsSync(ZIP_TESTING_FOLDER)) {
            fs.rmdirSync(ZIP_TESTING_FOLDER);
        }

        if (fs.existsSync(TEMP_FOLDER_PATH)) {
            fs.rmdirSync(TEMP_FOLDER_PATH, { recursive: true });
        }
    });

    const createTestFolder = (folderPath: string) => {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    };

    const createTestZip = async (fileName: string, path: string) => {
        createTestFolder(path);
        zipActionHandler.zipFile({fileName, path});
    };

    const removeTestFolder = (folderPath: string) => {
        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true });
        }
    };

    it('should be defined', () => {
        expect(zipActionHandler).toBeDefined();
        expect(serverConfigService).toBeDefined();
    });

    describe('Create archive', async() => {
        it('Should create zip folder when fileName is not provided', async() => {
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
            const zipName = 'zipArchiveName';
            const zipPath = `${TEMP_FOLDER_PATH}${path.sep}${zipName}`;
            const params: ZipFileActionInput = {
                fileName: zipName,
                path: zipPath
            };

            createTestFolder(zipPath);
            createTestFolder(`${zipPath}${path.sep}${zipName}`);
            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${zipPath}.zip`)
            ).toBeTruthy();
            removeTestFolder(`${zipPath}${path.sep}${zipName}`);
            removeTestFolder(`${zipPath}`);
            removeTestFolder(`${zipPath}.zip`);
        });

        it('Should throw error when path is not provided', async() => {
            const params: ZipFileActionInput = {
                fileName: TEST_FOLDER_NAME,
                path: undefined
            };

            await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
                'Path to a file/folder is mandatory'
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

    describe('Unzip archive', async() => {
        it('Should unzip files when path is not provided', async() => {
            const params: UnzipFileActionInput = {
                fileName: FOLDER_TO_UNZIP_NAME,
                path: undefined
            };

            await createTestZip(undefined, ZIP_TESTING_FOLDER);
            removeTestFolder(ZIP_TESTING_FOLDER);
            
            await zipActionHandler.unzipFile(params);
            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}`)
            ).toBeTruthy();
        });

        it('Should unzip zip folder when all parameters are provided', async() => {
            const params: UnzipFileActionInput = {
                fileName: FOLDER_TO_UNZIP_NAME,
                path: TEMP_FOLDER_PATH
            };

            await createTestZip(undefined, ZIP_TESTING_FOLDER);
            removeTestFolder(ZIP_TESTING_FOLDER);

            await zipActionHandler.unzipFile(params);
            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}`)
            ).toBeTruthy();
        });

        it('Should throw error when fileName is not provided', async() => {
            const params: UnzipFileActionInput = {
                fileName: undefined,
                path: TEMP_FOLDER_PATH
            };

            await expect(zipActionHandler.unzipFile(params)).rejects.toThrowError(
                'File name is mandatory'
            );
        });

        it('Should throw error when zip file already exists', async() => {
            const params: UnzipFileActionInput = {
                fileName: FOLDER_TO_UNZIP_NAME,
                path: TEMP_FOLDER_PATH
            };

            await createTestZip(undefined, ZIP_TESTING_FOLDER);

            await expect(zipActionHandler.unzipFile(params)).rejects.toThrowError(
                'File/folder with this name already exists'
            );
        });
    });
});