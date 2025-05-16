import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { ZipAction } from 'runbotics-common';
import { z } from 'zod';

export const unzipFileActionInputSchema = z.object({
    fileName: z.string(),
    path: z.string().optional(),
    outDirName: z.string().optional(),
    outDirPath: z.string().optional(),
});

export type ZipFileActionInput = {
    toZipPath: string;
    zipPath?: string;
};

export type UnzipFileActionInput = z.infer<typeof unzipFileActionInputSchema>

export type ZipActionRequest =
    | DesktopRunRequest<ZipAction.UNZIP_FILE, UnzipFileActionInput>
    | DesktopRunRequest<ZipAction.ZIP_FILE, ZipFileActionInput>
