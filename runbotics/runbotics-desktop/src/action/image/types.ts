import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { ImageAction } from 'runbotics-common';

export type ImageActionRequest =
    | DesktopRunRequest<ImageAction.GRAY_SCALE, GrayScaleActionInput>;

export type FilePath = string;

export interface GrayScaleActionInput {
    imagePath: FilePath;
    resultImagePath?: FilePath;
}
