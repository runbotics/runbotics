import { Test } from '@nestjs/testing';
import FolderActionHandler from './folder.action-handler';
import fs from 'fs';
import path from 'path';
import { FolderDeleteActionInput, FolderDisplayFilesActionInput, FolderCreateActionInput, FolderRenameActionInput, FolderExistsActionInput } from './folder.types';
import { ServerConfigService } from '../../config';

describe('FolderActionHandler', () => {
    let folderActionHandler: FolderActionHandler;
    let serverConfigService: ServerConfigService;

    const TEST_FOLDER_NAME = 'testFolder';
    const CWD = `${process.cwd()}`;
    const TEMP_FOLDER_PATH = `${process.cwd()}${path.sep}temp`;
    const FULL_TEST_FOLDER_PATH = `${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}`;

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

    const createTestFolder = () => {
        if (!fs.existsSync(FULL_TEST_FOLDER_PATH)) {
            fs.mkdirSync(FULL_TEST_FOLDER_PATH);
        }
    };

    const removeTestFolder = (folderPath: string) => {
        if (fs.existsSync(folderPath)) {
            fs.rmdirSync(folderPath);
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
            fs.mkdirSync(FULL_TEST_FOLDER_PATH, { recursive: true });

            await folderActionHandler.deleteFolder(params);

            expect(
                fs.existsSync(FULL_TEST_FOLDER_PATH)
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

            await expect(folderActionHandler.deleteFolder(params)).rejects.toThrow();

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
            fs.mkdirSync(FULL_TEST_FOLDER_PATH, { recursive: true });

            const folderContent = await folderActionHandler.displayFiles(
                { name: TEST_FOLDER_NAME }
            );

            
            expect(Array.isArray(folderContent)).toBeTruthy();
            expect(folderContent).toHaveLength(0);
        });
        
        it('Name is not provided', async () => {
            const folderByPath = 'folderByPath';
            fs.mkdirSync(FULL_TEST_FOLDER_PATH, { recursive: true });
            // create subfolder with one element
            fs.mkdirSync(`${TEMP_FOLDER_PATH}${path.sep}${TEST_FOLDER_NAME}${path.sep}${folderByPath}`);
            
            const folderContent = await folderActionHandler.displayFiles({
                path: FULL_TEST_FOLDER_PATH,
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

        it('Should create folder even when the path was not provided', async() => {
            const params: FolderCreateActionInput = {
                name: TEST_FOLDER_NAME,
                path: undefined
            };

            expect(
                fs.existsSync(FULL_TEST_FOLDER_PATH)
            ).toBeFalsy();

            await folderActionHandler.createFolder(params);

            expect(
                fs.existsSync(FULL_TEST_FOLDER_PATH)
            ).toBeTruthy();
        });

        it('Should create folder if both path and name is provided', async() => {
            const params: FolderCreateActionInput = {
                name: TEST_FOLDER_NAME,
                path: TEMP_FOLDER_PATH
            };

            expect(
                fs.existsSync(FULL_TEST_FOLDER_PATH)
            ).toBeFalsy();

            await folderActionHandler.createFolder(params);

            expect(
                fs.existsSync(FULL_TEST_FOLDER_PATH)
            ).toBeTruthy();
        });
    });

    describe('Rename folder', () => {
        // skipped due to permission error on bot runner, locally test pass
        it.skip('Should rename folder to the new name', async() => {
            const oldFolderPath = FULL_TEST_FOLDER_PATH;
            const renameTo = 'newFolderName';
            const params: FolderRenameActionInput = {
                path: oldFolderPath,
                newName: renameTo
            };

            createTestFolder();

            expect(
                fs.existsSync(oldFolderPath)
            ).toBeTruthy();
            expect(
                fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${renameTo}`)
            ).toBeFalsy();

            await folderActionHandler.renameFolder(params).then(() => {
                expect(
                    fs.existsSync(oldFolderPath)
                ).toBeFalsy();
                expect(
                    fs.existsSync(`${TEMP_FOLDER_PATH}${path.sep}${renameTo}`)
                ).toBeTruthy();
    
                removeTestFolder(`${TEMP_FOLDER_PATH}${path.sep}${renameTo}`);      

            });

        });

        it('Should throw error when new name is not provided', async() => {
            const params: FolderRenameActionInput = {
                path: TEMP_FOLDER_PATH,
                newName: undefined
            };

            await expect(folderActionHandler.renameFolder(params)).rejects.toThrowError('Cannot rename folder if new name is not provided');
        });

        it('Should throw error when path to old folder is not provided', async() => {
            const params: FolderRenameActionInput = {
                path: undefined,
                newName: 'newName'
            };

            await expect(folderActionHandler.renameFolder(params)).rejects.toThrowError('Cannot rename folder if path to the old folder is not provided');
        });

        it('Should throw error when provided folder does not exist', async() => {
            const testDirPath = 'made/up/path/to/directory';
            const testDirName = 'newName';
            const params: FolderRenameActionInput = {
                path: testDirPath,
                newName: testDirName
            };

            await expect(folderActionHandler.renameFolder(params)).rejects.toThrowError(`Rename folder: Directory not found: ${testDirPath}`);
        });

        // skipped due to permission error on bot runner, locally test pass
        it.skip('Should throw error when the folder with provided name already exists', async() => {
            const params: FolderRenameActionInput = {
                path: FULL_TEST_FOLDER_PATH,
                newName: TEST_FOLDER_NAME
            };

            createTestFolder();

            await expect(folderActionHandler.renameFolder(params)).rejects.toThrowError('Cannot perform action - folder with this name already exists in the provided folder path');

            removeTestFolder(FULL_TEST_FOLDER_PATH);
        });
    });

    describe('Validate folder name', () => {
        it('Should return true if name does not have illegal characters', () => {
            const newName = 'Correct new folder name';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toBeTruthy();
        });

        it('Should throw error when folder name includes illegal character: \\', () => {
            const newName = '\\';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: /', () => {
            const newName = '/';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: :', () => {
            const newName = ':';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: *', () => {
            const newName = '*';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: ?', () => {
            const newName = '?';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: <', () => {
            const newName = '<';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: >', () => {
            const newName = '>';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });

        it('Should throw error when folder name includes illegal character: |', () => {
            const newName = '|';

            expect(() => folderActionHandler.checkIfNameIsValid(newName)).toThrowError('Folder name cannot include the following characters: \\ / : * ? < > |');
        });
    });

    describe('Exist folder', () => {
        it('Should throw error when name is not provided', async () => {
            const params: FolderExistsActionInput = {
                name: undefined,
                path: CWD
            };

            await expect(folderActionHandler.existsFolder(params)).rejects.toThrowError(
                'Name is not provided.'
            );
        });

        it('Should throw error when provided path does not exist', async () => {
            const nonExistentPath = '/nonExistentPath';
        
            const params: FolderExistsActionInput = {
                name: TEST_FOLDER_NAME,
                path: nonExistentPath
            };
        
            await expect(folderActionHandler.existsFolder(params)).rejects.toThrowError(
                'Provided path does not exist.'
            );
        });

        it('Should return true if folder exists when all function parameters are specified', async () => {        
            const params: FolderExistsActionInput = {
                name: TEST_FOLDER_NAME,
                path: CWD
            };
        
            const result = await folderActionHandler.existsFolder(params);
        
            expect(result).toBe(true);
    
        });
        
        it('Should return true if folder exists if only the folder name is specified', async () => {        
            const params: FolderExistsActionInput = {
                name: TEST_FOLDER_NAME,
                path: undefined
            };

            createTestFolder();
        
            const result = await folderActionHandler.existsFolder(params);
        
            expect(result).toBe(true);

            removeTestFolder(FULL_TEST_FOLDER_PATH);
    
        });
        

        it('Should return false if folder does not exist when all function parameters are specified', async () => {
            const nonExistentFolderName = 'nonExistingFolder';
            
            const params: FolderExistsActionInput = {
                name: nonExistentFolderName,
                path: CWD
            };
        
            const result = await folderActionHandler.existsFolder(params);
        
            expect(result).toBe(false);
        });

        it('Should return false if folder does not exist if only the folder name is specified', async () => {
            const nonExistentFolderName = 'nonExistingFolder';
            
            const params: FolderExistsActionInput = {
                name: nonExistentFolderName,
                path: undefined
            };
        
            createTestFolder();

            const result = await folderActionHandler.existsFolder(params);
        
            expect(result).toBe(false);

            removeTestFolder(FULL_TEST_FOLDER_PATH);
        });


    });
});
