import { Test } from '@nestjs/testing';
import FolderActionHandler from './folder.action-handler';
import fs from 'fs';
import path from 'path';
import { FolderDeleteActionInput, FolderDisplayFilesActionInput, FolderCreateActionInput } from './folder.types';
import { ServerConfigService } from '../../config';

describe('FolderActionHandler', () => {
    let folderActionHandler: FolderActionHandler;
    let serverConfigService: ServerConfigService;

    const testFolderName = 'testFolder';
    const cwd = `${process.cwd()}`;
    const tempFolderPath = `${process.cwd()}${path.sep}temp`;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FolderActionHandler, 
                ServerConfigService
            ],
        })
            .overrideProvider(ServerConfigService)
            .useValue({
                tempFolderPath,
            })
            .compile();
        folderActionHandler = module.get(FolderActionHandler);
        serverConfigService = module.get(ServerConfigService);
    });

    beforeEach(async () => {
        fs.mkdirSync(`${cwd}${path.sep}${testFolderName}`);
    });

    afterEach(async () => {
        if (fs.existsSync(`${cwd}${path.sep}${testFolderName}`)) {
            fs.rmSync(`${cwd}${path.sep}${testFolderName}`, { recursive: true });
        }

        if (fs.existsSync(tempFolderPath)) {
            fs.rmSync(tempFolderPath, { recursive: true });
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
            fs.mkdirSync(`${cwd}${path.sep}${testFolderName}${path.sep}${TEST_SUBFOLDERS_ARRAY[i]}`);
        }
    };

    const removeTestSubfolders = () => {
        for (let i = 0; i < TEST_SUBFOLDERS_ARRAY.length; i++) {
            const fullPath = `${cwd}${path.sep}${testFolderName}${path.sep}${TEST_SUBFOLDERS_ARRAY[i]}`;
            if (fs.existsSync(fullPath)) {
                fs.rmSync(fullPath, { recursive: true });
            }
        }
    };

    const removeTestFolder = () => {
        const fullPath = `${tempFolderPath}${testFolderName}`;
        if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath);
        }
    };

    describe('Delete folder', async () => {
        it('Should remove empty folder', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path: cwd,
                recursive: false
            };

            await folderActionHandler.deleteFolder(params);
            expect(
                fs.existsSync(`${cwd}${path.sep}${testFolderName}`)
            ).toBeFalsy();
        });

        it('Should throw error when removing non-existent folder', async () => {
            const name = 'notExistingFolder';
            const params: FolderDeleteActionInput = {
                name,
                path: cwd,
                recursive: true
            };

            await expect(folderActionHandler.deleteFolder(params)).rejects.toThrowError(
                `Directory not found: ${cwd}${path.sep}${name}`
            );
        });

        it('Should remove empty /temp folder', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                recursive: false
            };
            fs.mkdirSync(`${tempFolderPath}${path.sep}${testFolderName}`, { recursive: true });

            await folderActionHandler.deleteFolder(params);

            expect(
                fs.existsSync(`${tempFolderPath}${path.sep}${testFolderName}`)
            ).toBeFalsy();
        });

        it('Should remove subfolders recursively', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path: cwd,
                recursive: true
            };

            createTestSubfolders();

            await folderActionHandler.deleteFolder(params);
            expect(
                fs.existsSync(`${cwd}${path.sep}${testFolderName}`)
            ).toBeFalsy();

            removeTestSubfolders();
        });

        it('Should not remove subfolders with recursive set false', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path: cwd,
                recursive: false
            };

            createTestSubfolders();

            await expect(
                folderActionHandler.deleteFolder(params)).rejects.toThrowError(
                `Cannot remove not empty directory without setting 'recursive' option: ${cwd}`
            );

            removeTestSubfolders();
        });
    });

    describe('Display files', () => {
        it('Should display content of folder', async () => {
            const params: FolderDisplayFilesActionInput = {
                name: testFolderName,
                path: cwd,
            };
            createTestSubfolders();

            const folderContent = await folderActionHandler.displayFiles(params);
            expect(folderContent).toEqual(TEST_SUBFOLDERS_ARRAY);

            removeTestSubfolders();
        });        

        it('Should throw error if accessing non-existent folder', async () => {
            const name = 'notExistingFile';
            const params: FolderDisplayFilesActionInput = {
                name,
                path: cwd,
            };

            await expect(folderActionHandler.displayFiles(params)).rejects.toThrowError(
                `Directory not found: ${cwd}${path.sep}${name}`
            );
        });

        it('Display empty folder', async () => {
            const params: FolderDisplayFilesActionInput = {
                name: TEST_SUBFOLDERS_ARRAY[0],
                path: `${cwd}${path.sep}${testFolderName}`,
            };
            createTestSubfolders();

            const folderContent = await folderActionHandler.displayFiles(params);
            expect(Array.isArray(folderContent)).toBeTruthy();
            expect(folderContent).toHaveLength(0);

            removeTestSubfolders();
        });

        it('Display /temp content if path not provided', async () => {
            fs.mkdirSync(`${tempFolderPath}${path.sep}${testFolderName}`, { recursive: true });

            const folderContent = await folderActionHandler.displayFiles(
                { name: testFolderName }
            );

            expect(Array.isArray(folderContent)).toBeTruthy();
            expect(folderContent).toHaveLength(0);
        });

        it('Name is not provided', async () => {
            const folderByPath = 'folderByPath';
            fs.mkdirSync(`${tempFolderPath}${path.sep}${testFolderName}`, { recursive: true });
            // create subfolder with one element
            fs.mkdirSync(`${tempFolderPath}${path.sep}${testFolderName}${path.sep}${folderByPath}`);

            const folderContent = await folderActionHandler.displayFiles({
                path: `${tempFolderPath}${path.sep}${testFolderName}`,
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
                path: cwd
            };

            await expect(folderActionHandler.createFolder(params)).rejects.toThrowError(
                'Cannot create directory if name is not provided'
            );
        });

        it('Should throw error if accessing non-existent folder', async () => {
            const name = 'notExistingFile';
            const params: FolderDisplayFilesActionInput = {
                name,
                path: cwd
            };

            await expect(folderActionHandler.displayFiles(params)).rejects.toThrowError(`Directory not found: ${cwd}${path.sep}${name}`);
        });

        it('Should throw error if path is not provided', async () => {
            const params: FolderCreateActionInput = {
                name: tempFolderPath,
                path: undefined
            };

            await expect(folderActionHandler.createFolder(params)).rejects.toThrowError(
                'Cannot create directory if path is not provided'
            );
        });

        it('Should throw error when folder with provided name already exists', async() => {
            const params: FolderCreateActionInput = {
                name: testFolderName,
                path: cwd
            };

            await expect(folderActionHandler.createFolder(params)).rejects.toThrowError(
                'Cannot create directory - folder with this name already exists in the provided folder path'
            );

            removeTestFolder();
        });
    });
});
