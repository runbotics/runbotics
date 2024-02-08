import { Test } from '@nestjs/testing';
import FolderActionHandler from './folder.action-handler';
import fs from 'fs';
import path from 'path';
import { FolderDeleteActionInput, FolderDisplayFilesActionInput, FolderCreateActionInput } from './folder.types';
import { ServerConfigService } from '../../config';

describe('FolderActionHandler', () => {
    let folderActionHandler: FolderActionHandler;
    let serverConfigService: ServerConfigService;

    const TEST_FOLDER_NAME = 'testFolder';
    const CWD = `${process.cwd()}`;
    const TEMP_FOLDER_PATH = `${process.cwd()}${path.sep}temp`;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FolderActionHandler, 
                ServerConfigService
            ],
        })
            .overrideProvider(ServerConfigService)
            .useValue({
                tempFolderPath: TEMP_FOLDER_PATH,
            })
            .compile();
        folderActionHandler = module.get(FolderActionHandler);
        serverConfigService = module.get(ServerConfigService);
    });

    beforeEach(async () => {
        fs.mkdirSync(`${CWD}${path.sep}${TEST_FOLDER_NAME}`);

        if (!fs.existsSync(TEMP_FOLDER_PATH)) {
            fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
        }
    });

    afterEach(async () => {
        if (fs.existsSync(`${CWD}${path.sep}${TEST_FOLDER_NAME}`)) {
            fs.rmSync(`${CWD}${path.sep}${TEST_FOLDER_NAME}`, { recursive: true });
        }

        if (fs.existsSync(TEMP_FOLDER_PATH)) {
            fs.rmSync(TEMP_FOLDER_PATH, { recursive: true });
        }
    });

    afterAll(async () => {
        if (fs.existsSync(serverConfigService.tempFolderPath)) {
            fs.rmSync(serverConfigService.tempFolderPath);
        }
    });

    it('should be defined', () => {
        expect(folderActionHandler).toBeDefined();
        expect(serverConfigService).toBeDefined();
    });

    const TEST_SUBFOLDERS_ARRAY = ['subfolder1', 'subfolder2', 'subfolder3', 'subfolder4', 'subfolder5', 'subfolder6'];

    const createTestSubfolders = () => {
        for (let i = 0; i < TEST_SUBFOLDERS_ARRAY.length; i++) {
            fs.mkdirSync(`${CWD}${path.sep}${TEST_FOLDER_NAME}${path.sep}${TEST_SUBFOLDERS_ARRAY[i]}`);
        }
    };

    const removeTestSubfolders = () => {
        for (let i = 0; i < TEST_SUBFOLDERS_ARRAY.length; i++) {
            const fullPath = `${CWD}${path.sep}${TEST_FOLDER_NAME}${path.sep}${TEST_SUBFOLDERS_ARRAY[i]}`;
            if (fs.existsSync(fullPath)) {
                fs.rmSync(fullPath, { recursive: true });
            }
        }
    };

    describe('Delete folder', async () => {
        it('Should remove empty folder', async () => {
            const params: FolderDeleteActionInput = {
                name: TEST_FOLDER_NAME,
                path: CWD,
                recursive: false
            };

            await folderActionHandler.deleteFolder(params);
            expect(
                fs.existsSync(`${CWD}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeFalsy();
        });

        it('Should throw error when removing non-existent folder', async () => {
            const name = 'notExistingFolder';
            const params: FolderDeleteActionInput = {
                name,
                path: CWD,
                recursive: true
            };

            await expect(folderActionHandler.deleteFolder(params)).rejects.toThrowError(
                `Delete folder: Directory not found: ${CWD}${path.sep}${name}`
            );
        });

        it('Should remove empty test folder', async () => {
            const params: FolderDeleteActionInput = {
                name: TEST_FOLDER_NAME,
                recursive: false
            };
            fs.mkdirSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`, { recursive: true });

            await folderActionHandler.deleteFolder(params);

            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeFalsy();
        });

        it('Should remove subfolders recursively', async () => {
            const params: FolderDeleteActionInput = {
                name: TEST_FOLDER_NAME,
                path: CWD,
                recursive: true
            };

            createTestSubfolders();

            await folderActionHandler.deleteFolder(params);
            expect(
                fs.existsSync(`${CWD}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeFalsy();

            removeTestSubfolders();
        });

        it('Should not remove subfolders with recursive set false', async () => {
            const params: FolderDeleteActionInput = {
                name: TEST_FOLDER_NAME,
                path: CWD,
                recursive: false
            };

            createTestSubfolders();

            await expect(
                folderActionHandler.deleteFolder(params)).rejects.toThrowError(
                `Delete folder: Cannot perform action on empty directory without setting 'recursive' option: ${CWD}`
            );

            removeTestSubfolders();
        });
    });

    describe('Display files', () => {
        it('Should display content of folder', async () => {
            const params: FolderDisplayFilesActionInput = {
                name: TEST_FOLDER_NAME,
                path: CWD,
            };
            createTestSubfolders();

            const folderContent = await folderActionHandler.displayFiles(params);
            expect(folderContent).toEqual(TEST_SUBFOLDERS_ARRAY);

            removeTestSubfolders();
        });        

        it('Should throw error if accessing non-existent folder', async () => {
            const name = 'notExistingFolder';
            const params: FolderDisplayFilesActionInput = {
                name,
                path: CWD,
            };

            await expect(folderActionHandler.displayFiles(params)).rejects.toThrowError(
                `Display files: Directory not found: ${CWD}${path.sep}${name}`
            );
        });

        it('Display empty folder', async () => {
            const params: FolderDisplayFilesActionInput = {
                name: TEST_SUBFOLDERS_ARRAY[0],
                path: `${CWD}${path.sep}${TEST_FOLDER_NAME}`,
            };
            createTestSubfolders();

            const folderContent = await folderActionHandler.displayFiles(params);
            expect(Array.isArray(folderContent)).toBeTruthy();
            expect(folderContent).toHaveLength(0);

            removeTestSubfolders();
        });

        it('Display /temp content if path not provided', async () => {
            fs.mkdirSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`, { recursive: true });

            const folderContent = await folderActionHandler.displayFiles(
                { name: TEST_FOLDER_NAME }
            );

            
            expect(Array.isArray(folderContent)).toBeTruthy();
            expect(folderContent).toHaveLength(0);
        });
        
        it('Name is not provided', async () => {
            const folderByPath = 'folderByPath';
            fs.mkdirSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`, { recursive: true });
            // create subfolder with one element
            fs.mkdirSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}${path.sep}${folderByPath}`);
            
            const folderContent = await folderActionHandler.displayFiles({
                path: `${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`,
            });

            expect(Array.isArray(folderContent)).toBeTruthy();
            expect(folderContent).toHaveLength(1);
            expect(folderContent).toContain(folderByPath);
        });
    });

    describe('Create folder', () => {
        it('Should throw error when name is not provided', async () => {
            const params: FolderCreateActionInput = {
                name: undefined,
                path: CWD
            };

            await expect(folderActionHandler.createFolder(params)).rejects.toThrowError(
                'Cannot create directory if name is not provided'
            );
        });

        it('Should throw error if accessing non-existent folder', async () => {
            const testDirPath = 'made/up/path/to/directory';
            const testDirName = 'testDirName';
            const params: FolderCreateActionInput = {
                name: testDirName,
                path: testDirPath
            };

            await expect(folderActionHandler.createFolder(params)).rejects.toThrowError(`Create folder: Directory not found: ${testDirPath}${path.sep}${testDirName}`);
        });

        it('Should throw error when folder with provided name already exists', async() => {
            const params: FolderCreateActionInput = {
                name: TEST_FOLDER_NAME,
                path: CWD
            };

            await expect(folderActionHandler.createFolder(params)).rejects.toThrowError(
                'Create folder: Cannot perform action - folder with this name already exists in the provided folder path'
            );
        });

        // working on - handle these both
        it('Should create folder even when the path was not provided', async() => {
            const params: FolderCreateActionInput = {
                name: TEST_FOLDER_NAME,
                path: undefined
            };

            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeFalsy();

            await folderActionHandler.createFolder(params);

            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeTruthy();
        });

        it('Should create folder if both path and name is provided', async() => {
            const params: FolderCreateActionInput = {
                name: TEST_FOLDER_NAME,
                path: TEMP_FOLDER_PATH
            };

            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeFalsy();

            await folderActionHandler.createFolder(params);

            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`)
            ).toBeTruthy();
        });
    });
});
