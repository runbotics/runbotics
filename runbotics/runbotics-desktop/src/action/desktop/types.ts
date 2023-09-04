import { DesktopRunRequest } from 'runbotics-sdk';

export const KEY_REFERENCE = 'Key.';
export const OCR_CONFIDENCE = 0.9;

export type DesktopActionRequest =
| DesktopRunRequest<'desktop.click', DesktopClickActionInput>
| DesktopRunRequest<'desktop.type', DesktopTypeActionInput>
| DesktopRunRequest<'desktop.copy', DesktopCopyActionInput>
| DesktopRunRequest<'desktop.paste'>
| DesktopRunRequest<'desktop.cursorSelect', DesktopCursorSelectActionInput>
| DesktopRunRequest<'desktop.readClipboardContent'>
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

export enum ImageResourceFormat {
    PNG = 'PNG',
    JPG = 'JPG'
}

export enum Language {
    EN = 'ENG',
    PL = 'POL',
    DE = 'DEU'
}

export type Coordinate = string | number;

export interface PointObj {
    x: Coordinate;
    y: Coordinate;
}

export interface RegionObj {
    left: Coordinate;
    top: Coordinate;
    width: Coordinate;
    height: Coordinate;
}

export type DesktopClickActionInput = {
    clickTarget: ClickTarget;
    point?: any;
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

export type DesktopCursorSelectActionInput = {
    startPoint: any;
    endPoint: any;
}

export type DesktopReadClipboardContentActionOutput = string;

export type DesktopFindScreenRegionActionInput = {
    imageFullPath: string;
}

export type DesktopWaitForScreenRegionActionInput = {
    imageFullPath: string;
}

export type DesktopTakeScreenshotActionInput = {
    imageName?: string;
    imagePath?: string;
    imageFormat: ImageResourceFormat;
    region?: any;
}

export type DesktopTakeScreenshotActionOutput = string;

export type DesktopReadTextFromImageActionInput = {
    imageFullPath: string;
    language: Language;
}

export type DesktopReadTextFromImageActionOutput = string;
