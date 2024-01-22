import { Test } from '@nestjs/testing';
import FolderActionHandler from './folder.action-handler';
import fs from 'fs';
import path from 'path';
import { FolderDeleteActionInput } from './folder.types';
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
                ServerConfigService,
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
        fs.mkdir(`${cwd}${path.sep}${testFolderName}`, () => { });
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

    it('Should throw error when removing not existing folder', async () => {
        const name = 'notExistingFile';
        const params: FolderDeleteActionInput = {
            name,
            path: cwd,
            recursive: true
        };

        await expect(folderActionHandler.deleteFolder(params)).rejects.toThrowError(
            `Directory not found: ${cwd}${path.sep}${name}`
        );
    });

    it('Should remove empty folder with default path', async () => {
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

    describe('Operations with nested folders', () => {
        const subfolders = ['subfolder1', 'subfolder2', 'subfolder3', 'subfolder4', 'subfolder5', 'subfolder6'];

        beforeEach(async () => {
            for (let i = 0; i < subfolders.length; i++) {
                fs.mkdir(`${cwd}${path.sep}${testFolderName}${path.sep}${subfolders[i]}`, () => { });
            }
        });

        afterEach(async () => {
            for (let i = 0; i < subfolders.length; i++) {
                const fullPath = `${cwd}${path.sep}${testFolderName}${path.sep}${subfolders[i]}`;
                if (fs.existsSync(fullPath)) {
                    fs.rmSync(fullPath, { recursive: true });
                }
            }
        });

        it('Should remove folder with subfolders with recursive set to true', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path: cwd,
                recursive: true
            };

            await folderActionHandler.deleteFolder(params);
            expect(
                fs.existsSync(`${cwd}${path.sep}${testFolderName}`)
            ).toBeFalsy();
        });

        it('Should not remove folder containing subfolders with recursive set to false', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path: cwd,
                recursive: false
            };

            await expect(folderActionHandler.deleteFolder(params)).rejects.toThrowError(
                `Cannot remove not empty directory without setting 'recursive' option: ${cwd}`
            );
        });
    });
});
