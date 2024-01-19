import { Test } from '@nestjs/testing';
import FolderActionHandler from './folder.action-handler';
import fs from 'fs';
import pathPackage from 'path';
import { FolderDeleteActionInput } from './folder.types';
import { ServerConfigService } from '../../config';

describe('FolderActionHandler', () => {
    let folderActionHandler: FolderActionHandler;
    let serverConfigService: ServerConfigService;

    const testFolderName = 'testFolder';
    const path = `${process.cwd()}`;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FolderActionHandler,
                ServerConfigService,
            ],
        }).compile();
        folderActionHandler = module.get(FolderActionHandler);
        serverConfigService = module.get(ServerConfigService);
    });

    beforeEach(async () => {
        fs.mkdir(`${path}${pathPackage.sep}${testFolderName}`, () => {});
    });

    afterEach(async () => {
        if (fs.existsSync(`${path}${pathPackage.sep}${testFolderName}`)){
            fs.rmSync(`${path}${pathPackage.sep}${testFolderName}`, { recursive: true });
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
            path,
            recursive: false
        };

        await folderActionHandler.deleteFolder(params);
        expect( 
            fs.existsSync(`${path}${pathPackage.sep}${testFolderName}`)
        ).toBeFalsy();
    });

    it('Should throw error when removing not existing folder', async () => {
        const name = 'notExistingFile';
        const params: FolderDeleteActionInput = {
            name,
            path,
            recursive: true
        };

        await expect(folderActionHandler.deleteFolder(params)).rejects.toThrowError(
            `Directory not found: ${path}${pathPackage.sep}${name}`
        );
    });

    /* TODO: check why ServerConfigService is undefined in tests runner & unskip it after fix */
    it.skip('Should remove empty folder with default path', async () => {
        const params: FolderDeleteActionInput = {
            name: testFolderName,
            recursive: false
        };

        await folderActionHandler.deleteFolder(params);
        expect( 
            fs.existsSync(`${path}${pathPackage.sep}${testFolderName}`)
        ).toBeFalsy();
    });

    describe('Operations with nested folders', () => {
        const subfolders = [ 'subfolder1', 'subfolder2', 'subfolder3', 'subfolder4', 'subfolder5', 'subfolder6'];

        beforeEach(async () => {
            for (let i = 0; i < subfolders.length; i++){
                fs.mkdir(`${path}${pathPackage.sep}${testFolderName}${pathPackage.sep}${subfolders[i]}`, () => {});
            };
        });

        afterEach(async () => {
            for (let i = 0; i < subfolders.length; i++){
                const fullPath = `${path}${pathPackage.sep}${testFolderName}${pathPackage.sep}${subfolders[i]}`;
                if (fs.existsSync(fullPath)) {
                    fs.rmSync(fullPath, { recursive: true })
                }
            };
        });

        it('Should remove folder with subfolders with recursive set to true', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path,
                recursive: true
            };

            await folderActionHandler.deleteFolder(params);
            expect( 
                fs.existsSync(`${path}${pathPackage.sep}${testFolderName}`)
            ).toBeFalsy();
        });

        it('Should not remove folder containing subfolders with recursive set to false', async () => {
            const params: FolderDeleteActionInput = {
                name: testFolderName,
                path,
                recursive: false
            };

            await expect(folderActionHandler.deleteFolder(params)).rejects.toThrowError(
                `Cannot remove not empty directory without setting 'recursive' option: ${path}`
            );
        });
    }); 
});