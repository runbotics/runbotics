// import { Test } from '@nestjs/testing';
// import fs from 'fs';
// import path from 'path';
// import ZipActionHandler from './zip.action-handler';
// import { ServerConfigService } from '../../config';
// import { UnzipFileActionInput, ZipFileActionInput } from './zip.types';
// import { FileSystemErrorMessages } from 'runbotics-common';
// import AdmZip from 'adm-zip';

describe('FolderActionHandler', () => {
    it('should first', () => { })
    // let zipActionHandler: ZipActionHandler;
    // let serverConfigService: ServerConfigService;

    // const TEMP_FOLDER_PATH = `${process.cwd()}${path.sep}temp`;
    // const ARCHIVE_NAME = 'zipArchiveName';
    // const ARCHIVE_FOLDER_PATH = `${TEMP_FOLDER_PATH}${path.sep}${ARCHIVE_NAME}`;

    // beforeEach(async () => {
    //     const module = await Test.createTestingModule({
    //         providers: [
    //             ZipActionHandler, 
    //             ServerConfigService
    //         ],
    //     })
    //         .overrideProvider(ServerConfigService)
    //         .useValue({
    //             tempFolderPath: TEMP_FOLDER_PATH,
    //         })
    //         .compile();
    //     zipActionHandler = module.get(ZipActionHandler);
    //     serverConfigService = module.get(ServerConfigService);
    // });

    // beforeEach(async () => {
    //     if (!fs.existsSync(TEMP_FOLDER_PATH)) {
    //         fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
    //     }

    //     if (fs.existsSync(`${ARCHIVE_FOLDER_PATH}.zip`)) {
    //         fs.rmSync(`${ARCHIVE_FOLDER_PATH}.zip`);
    //     }
    // });

    // afterEach(async () => {
    //     if (fs.existsSync(ARCHIVE_FOLDER_PATH)) {
    //         fs.rmSync(ARCHIVE_FOLDER_PATH, { recursive: true });
    //     }

    //     if (fs.existsSync(`${TEMP_FOLDER_PATH}.zip`)) {
    //         fs.rmSync(`${TEMP_FOLDER_PATH}.zip`, { recursive: true });
    //     }

    // });

    // afterAll(async () => {
    //     removeExistingFolder(serverConfigService.tempFolderPath);
    //     removeExistingFolder(ARCHIVE_FOLDER_PATH, false);
    //     removeExistingFolder(TEMP_FOLDER_PATH);
    // });

    // const createTestFolder = (folderPath: string) => {
    //     if (!fs.existsSync(folderPath)) {
    //         fs.mkdirSync(folderPath, { recursive: true });
    //     }
    // };

    // const createTestZip = async () => {
    //     const zip = new AdmZip();

    //     createTestFolder(ARCHIVE_FOLDER_PATH);
    //     zip.addLocalFolder(ARCHIVE_FOLDER_PATH);
    //     zip.writeZip(`${ARCHIVE_FOLDER_PATH}.zip`);
    // };

    // const removeExistingFolder = (folderPath: string, recursive = true) => {
    //     if (fs.existsSync(folderPath)) {
    //         fs.rmSync(folderPath, { recursive: recursive });
    //     }
    // };

    // it('should be defined', () => {
    //     expect(zipActionHandler).toBeDefined();
    //     expect(serverConfigService).toBeDefined();
    // });

    // describe('Create archive', async() => {
    //     const NEW_ARCHIVE_NAME = 'zipAsName';
    //     const ARCHIVE_FOLDER_WITH_NEW_NAME_PATH = `${TEMP_FOLDER_PATH}${path.sep}${NEW_ARCHIVE_NAME}.zip`;

    //     // only mandatory input provided (zipped in TEMP_FOLDER_PATH)
    //     // skipped - works locally on windows, doesn't work during job processing on linux
    //     it.skip('Should create zip if path to the file is relative and destination path is not provided', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: ARCHIVE_NAME,
    //             zipPath: undefined,
    //         };

    //         createTestFolder(ARCHIVE_FOLDER_PATH);
    //         await zipActionHandler.zipFile(params);
    //         expect(
    //             fs.existsSync(`${ARCHIVE_FOLDER_PATH}.zip`)
    //         ).toBeTruthy();
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}.zip`);
    //     });

    //     it.skip('Should create zip if path to the file is absolute and destination path is not provided', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: ARCHIVE_FOLDER_PATH,
    //             zipPath: undefined
    //         };

    //         createTestFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         await zipActionHandler.zipFile(params);
    //         expect(
    //             fs.existsSync(`${ARCHIVE_FOLDER_PATH}.zip`)
    //         ).toBeTruthy();
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}.zip`);
    //     });

    //     // both inputs provided (zipped in provided zipPath)
    //     it.skip('Should create zip if path to the file is relative and destination path is provided', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: ARCHIVE_NAME,
    //             zipPath: ARCHIVE_FOLDER_WITH_NEW_NAME_PATH,
    //         };

    //         createTestFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         await zipActionHandler.zipFile(params);
    //         expect(
    //             fs.existsSync(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}`)
    //         ).toBeTruthy();
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         removeExistingFolder(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}`);
    //     });

    //     it.skip('Should create zip if path to the file is absolute and destination path is provided', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: ARCHIVE_FOLDER_PATH,
    //             zipPath: ARCHIVE_FOLDER_WITH_NEW_NAME_PATH,
    //         };

    //         createTestFolder(`${ARCHIVE_FOLDER_PATH }`);
    //         await zipActionHandler.zipFile(params);
    //         expect(
    //             fs.existsSync(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}`)
    //         ).toBeTruthy();
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH }`);
    //         removeExistingFolder(`${ARCHIVE_FOLDER_WITH_NEW_NAME_PATH}`);
    //     });

    //     // errors
    //     it('Should throw error when path to what to zip is not found', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: undefined,
    //             zipPath: undefined,
    //         };

    //         await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
    //             'Path to the file/folder to archive is mandatory'
    //         );
    //     });

    //     it('Should throw error when resource not found', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: 'notExistingFolderName',
    //             zipPath: undefined,
    //         };

    //         await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
    //             `Create archive action: ${FileSystemErrorMessages.ENOENT}`
    //         );
    //     });

    //     it('Should throw error when zip file already exists', async() => {
    //         const params: ZipFileActionInput = {
    //             toZipPath: ARCHIVE_NAME,
    //             zipPath: undefined,
    //         };

    //         createTestZip();
    //         await expect(zipActionHandler.zipFile(params)).rejects.toThrowError(
    //             `Create archive action: ${FileSystemErrorMessages.EBUSY}`
    //         );
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}.zip`);
    //     });
    // });

    // describe('Unzip archive', async() => {
    //     it('Should unzip files when path is not provided', async() => {
    //         const folderToUnzipPath = `${ARCHIVE_FOLDER_PATH}${path.sep}${ARCHIVE_NAME}`;
    //         const params: UnzipFileActionInput = {
    //             fileName: ARCHIVE_NAME,
    //             path: undefined
    //         };

    //         createTestFolder(ARCHIVE_FOLDER_PATH);
    //         createTestFolder(folderToUnzipPath);
    //         createTestZip();
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         expect(
    //             fs.existsSync(folderToUnzipPath)
    //         ).toBeFalsy();

    //         await zipActionHandler.unzipFile(params);
    //         expect(
    //             fs.existsSync(folderToUnzipPath)
    //         ).toBeTruthy();

    //         removeExistingFolder(folderToUnzipPath);
    //         removeExistingFolder(`${folderToUnzipPath}.zip`);
    //     });

    //     it('Should unzip archive when all parameters are provided', async() => {
    //         const folderToUnzipPath = `${ARCHIVE_FOLDER_PATH}${path.sep}${ARCHIVE_NAME}`;
    //         const params: UnzipFileActionInput = {
    //             fileName: ARCHIVE_NAME,
    //             path: TEMP_FOLDER_PATH
    //         };

    //         createTestFolder(ARCHIVE_FOLDER_PATH);
    //         createTestFolder(folderToUnzipPath);
    //         createTestZip();
    //         removeExistingFolder(`${ARCHIVE_FOLDER_PATH}`);
    //         expect(
    //             fs.existsSync(folderToUnzipPath)
    //         ).toBeFalsy();

    //         await zipActionHandler.unzipFile(params);
    //         expect(
    //             fs.existsSync(`${ARCHIVE_FOLDER_PATH}`)
    //         ).toBeTruthy();

    //         removeExistingFolder(folderToUnzipPath);
    //         removeExistingFolder(`${folderToUnzipPath}.zip`);
    //     });

    //     it('Should throw error when fileName is not provided', async() => {
    //         const params: UnzipFileActionInput = {
    //             fileName: undefined,
    //             path: TEMP_FOLDER_PATH
    //         };

    //         await expect(zipActionHandler.unzipFile(params)).rejects.toThrowError(
    //             'File name is mandatory'
    //         );

    //         removeExistingFolder(`${TEMP_FOLDER_PATH}${ARCHIVE_NAME}`);
    //         removeExistingFolder(`${TEMP_FOLDER_PATH}${ARCHIVE_NAME}.zip`);
    //     });

    //     it('Should throw error when zip file already exists', async() => {
    //         const params: UnzipFileActionInput = {
    //             fileName: ARCHIVE_NAME,
    //             path: TEMP_FOLDER_PATH
    //         };

    //         await createTestZip();
    //         await expect(zipActionHandler.unzipFile(params)).rejects.toThrowError(
    //             'File/folder with this name already exists'
    //         );

    //         removeExistingFolder(`${TEMP_FOLDER_PATH}${ARCHIVE_NAME}`);
    //         removeExistingFolder(`${TEMP_FOLDER_PATH}${ARCHIVE_NAME}.zip`);
    //     });
    // });
});