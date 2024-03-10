import { Test } from '@nestjs/testing';
import fs from 'fs';
import path from 'path';
import ZipActionHandler from './zip.action-handler';
import { ServerConfigService } from '../../config';
import { UnzipFileActionInput, ZipFileActionInput } from './zip.types';
import { FileSystemErrorMessages } from 'runbotics-common';

describe('FolderActionHandler', () => {
    let zipActionHandler: ZipActionHandler;
    let serverConfigService: ServerConfigService;

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

    const createTestZip = async (fileName: string, filePath?: string, zipName?: string) => {
        const toZipPath = filePath ? `${filePath}${path.sep}${fileName}` : `${TEMP_FOLDER_PATH}${path.sep}${fileName}`;
        createTestFolder(toZipPath);
        zipActionHandler.zipFile({ fileName, path: filePath, zipName});
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
        const ARCHIVE_NAME = 'zipArchiveName';
        const NEW_ARCHIVE_NAME = 'zipAsName';
        const ARCHIVE_FOLDER_PATH = `${TEMP_FOLDER_PATH}${path.sep}${ARCHIVE_NAME}`;
        const ARCHIVE_FOLDER_WITH_NEW_NAME_PATH = `${TEMP_FOLDER_PATH}${path.sep}${NEW_ARCHIVE_NAME}`;

        it('Should create zip named with fileName when optional inputs (path and zipName) are not provided', async() => {
            const params: ZipFileActionInput = {
                fileName: ARCHIVE_NAME,
                path: undefined,
                zipName: undefined
            };

            createTestFolder(ARCHIVE_FOLDER_PATH);
            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${ARCHIVE_FOLDER_PATH}.zip`)
            ).toBeTruthy();
            removeTestFolder(`${ARCHIVE_FOLDER_PATH}`);
            removeTestFolder(`${ARCHIVE_FOLDER_PATH}.zip`);
        });

        it('Should create zip named with fileName name when optional path is provided and optional zipName is not provided', async() => {
            const params: ZipFileActionInput = {
                fileName: ARCHIVE_NAME,
                path: TEMP_FOLDER_PATH,
                zipName: undefined
            };

            createTestFolder(`${ARCHIVE_FOLDER_PATH}`);
            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${ARCHIVE_FOLDER_PATH}.zip`)
            ).toBeTruthy();
            removeTestFolder(`${ARCHIVE_FOLDER_PATH}`);
            removeTestFolder(`${ARCHIVE_FOLDER_PATH}.zip`);
        });

        it('Should create zip named with new zipName when optional path is not provided', async() => {
            const params: ZipFileActionInput = {
                fileName: ARCHIVE_NAME,
                path: undefined,
                zipName: NEW_ARCHIVE_NAME 
            };

            createTestFolder(`${ARCHIVE_FOLDER_PATH }`);
            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}.zip`)
            ).toBeTruthy();
            removeTestFolder(`${ARCHIVE_FOLDER_PATH }`);
            removeTestFolder(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}.zip`);
        });

        it('Should create zip named with new zipName when all parameters are provided', async() => {
            const toZipPath = ARCHIVE_FOLDER_PATH;
            const params: ZipFileActionInput = {
                fileName: ARCHIVE_NAME,
                path: TEMP_FOLDER_PATH,
                zipName: NEW_ARCHIVE_NAME

            };

            createTestFolder(toZipPath);
            await zipActionHandler.zipFile(params);
            expect(
                fs.existsSync(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}.zip`)
            ).toBeTruthy();
            removeTestFolder(toZipPath);
            removeTestFolder(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}.zip`);
        });

        it('Should throw error when fileName is not found', async() => {
            const params: ZipFileActionInput = {
                fileName: 'notExistingFolderName',
                path: undefined,
                zipName: undefined
            };

            await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
                `Create archive action: ${FileSystemErrorMessages.ENOENT}`
            );
        });

        it('Should throw error when fileName is not provided', async() => {
            const params: ZipFileActionInput = {
                fileName: undefined,
                path: undefined,
                zipName: undefined
            };

            await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
                'File name is mandatory'
            );
        });

        it('Should throw error when zip file already exists', async() => {
            const params: ZipFileActionInput = {
                fileName: ARCHIVE_NAME,
                path: undefined,
                zipName: undefined
            };

            createTestZip(ARCHIVE_NAME, TEMP_FOLDER_PATH);
            await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
                `Create archive action: ${FileSystemErrorMessages.EBUSY}`
            );
            removeTestFolder(`${ARCHIVE_FOLDER_PATH }`);
            removeTestFolder(`${ARCHIVE_FOLDER_PATH }.zip`);
        });
    });

    describe('Unzip archive', async() => {
        it('Should unzip files when path is not provided', async() => {
            const folderToUnzipPath = `${ZIP_TESTING_FOLDER}${path.sep}${FOLDER_TO_UNZIP_NAME}`;
            const params: UnzipFileActionInput = {
                fileName: FOLDER_TO_UNZIP_NAME,
                path: undefined
            };

            createTestFolder(ZIP_TESTING_FOLDER);
            createTestFolder(folderToUnzipPath);
            createTestZip(FOLDER_TO_UNZIP_NAME, TEMP_FOLDER_PATH);
            removeTestFolder(`${ZIP_TESTING_FOLDER}`);
            expect(
                fs.existsSync(folderToUnzipPath)
            ).toBeFalsy();
            
            await zipActionHandler.unzipFile(params);
            expect(
                fs.existsSync(folderToUnzipPath)
            ).toBeTruthy();

            removeTestFolder(folderToUnzipPath);
            removeTestFolder(`${folderToUnzipPath}.zip`);
        });

        it('Should unzip archive when all parameters are provided', async() => {
            const folderToUnzipPath = `${ZIP_TESTING_FOLDER}${path.sep}${FOLDER_TO_UNZIP_NAME}`;
            const params: UnzipFileActionInput = {
                fileName: FOLDER_TO_UNZIP_NAME,
                path: TEMP_FOLDER_PATH
            };

            createTestFolder(ZIP_TESTING_FOLDER);
            createTestFolder(folderToUnzipPath);
            createTestZip(FOLDER_TO_UNZIP_NAME, TEMP_FOLDER_PATH);
            removeTestFolder(`${ZIP_TESTING_FOLDER}`);
            expect(
                fs.existsSync(folderToUnzipPath)
            ).toBeFalsy();

            await zipActionHandler.unzipFile(params);
            expect(
                fs.existsSync(`${ZIP_TESTING_FOLDER}`)
            ).toBeTruthy();

            removeTestFolder(folderToUnzipPath);
            removeTestFolder(`${folderToUnzipPath}.zip`);
        });

        it('Should throw error when fileName is not provided', async() => {
            const params: UnzipFileActionInput = {
                fileName: undefined,
                path: TEMP_FOLDER_PATH
            };

            await expect(zipActionHandler.unzipFile(params)).rejects.toThrowError(
                'File name is mandatory'
            );

            removeTestFolder(`${TEMP_FOLDER_PATH}${FOLDER_TO_UNZIP_NAME}`);
            removeTestFolder(`${TEMP_FOLDER_PATH}${FOLDER_TO_UNZIP_NAME}.zip`);
        });

        it('Should throw error when zip file already exists', async() => {
            const params: UnzipFileActionInput = {
                fileName: FOLDER_TO_UNZIP_NAME,
                path: TEMP_FOLDER_PATH
            };

            await createTestZip(FOLDER_TO_UNZIP_NAME, TEMP_FOLDER_PATH);
            await expect(zipActionHandler.unzipFile(params)).rejects.toThrowError(
                'File/folder with this name already exists'
            );

            removeTestFolder(`${TEMP_FOLDER_PATH}${FOLDER_TO_UNZIP_NAME}`);
            removeTestFolder(`${TEMP_FOLDER_PATH}${FOLDER_TO_UNZIP_NAME}.zip`);
        });
    });
});