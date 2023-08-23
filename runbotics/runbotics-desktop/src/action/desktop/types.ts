import { DesktopRunRequest } from 'runbotics-sdk';

import { FileType } from '@nut-tree/nut-js';

export type DesktopActionRequest =
| DesktopRunRequest<'desktop.click', DesktopClickActionInput>
| DesktopRunRequest<'desktop.type', DesktopTypeActionInput>
| DesktopRunRequest<'desktop.copy', DesktopCopyActionInput>
| DesktopRunRequest<'desktop.paste'>
| DesktopRunRequest<'desktop.selectWithCursor', DesktopSelectWithCursorActionInput>
| DesktopRunRequest<'desktop.readContentFromClipboard'>
| DesktopRunRequest<'desktop.maximizeActiveWindow'>
| DesktopRunRequest<'desktop.findScreenRegion', DesktopFindScreenRegionActionInput>
| DesktopRunRequest<'desktop.waitForScreenRegion', DesktopWaitForScreenRegionActionInput>
| DesktopRunRequest<'desktop.takeScreenshot', DesktopTakeScreenshotActionInput>
| DesktopRunRequest<'desktop.readTextFromImage', DesktopReadTextFromImageActionInput>;

export enum MouseButton {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT'
}

export enum ClickTarget {
    POINT = 'Point',
    REGION = 'Region'
}

export enum FileFormat {
    PNG = 'PNG',
    JPG = 'JPG'
}

export enum Language {
    EN = 'ENG',
    PL = 'POL',
    DE = 'DEU'
}

export type Coordinate = string | number;

export type RegionObj = {
    left: Coordinate;
    top: Coordinate;
    width: Coordinate;
    height: Coordinate;
}

export type DesktopClickActionInput = {
    clickTarget: ClickTarget;
    x?: Coordinate;
    y?: Coordinate;
    region?: any;
    mouseButton: MouseButton;
    doubleClick: boolean;
};

export type DesktopTypeActionInput = {
    text: string;
}

export type DesktopCopyActionInput = {
    text?: string;
}

export type DesktopSelectWithCursorActionInput = {
    startX: Coordinate;
    startY: Coordinate;
    endX: Coordinate;
    endY: Coordinate;
}

export type DesktopReadContentFromClipboardActionOutput = string;

export type DesktopFindScreenRegionActionInput = {
    imagePath: string;
}

export type DesktopWaitForScreenRegionActionInput = {
    imagePath: string;
}

export type DesktopTakeScreenshotActionInput = {
    fileName?: string;
    region?: any;
    fileFormat: FileFormat;
    filePath?: string;
}

export type DesktopTakeScreenshotActionOutput = string;

export type DesktopReadTextFromImageActionInput = {
    imagePath: string;
    language: Language;
}

export type DesktopReadTextFromImageActionOutput = string;
