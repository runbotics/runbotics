import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { DesktopAction } from 'runbotics-common';

export const KEY_REFERENCE = 'Key.';

export type DesktopActionRequest =
    | DesktopRunRequest<DesktopAction.CLICK, DesktopClickActionInput>
    | DesktopRunRequest<DesktopAction.TYPE, DesktopTypeActionInput>
    | DesktopRunRequest<DesktopAction.TYPE_CREDENTIALS, DesktopTypeCredentialsActionInput>
    | DesktopRunRequest<DesktopAction.COPY, DesktopCopyActionInput>
    | DesktopRunRequest<DesktopAction.PASTE>
    | DesktopRunRequest<DesktopAction.CURSOR_SELECT, DesktopCursorSelectActionInput>
    | DesktopRunRequest<DesktopAction.READ_CLIPBOARD_CONTENT>
    | DesktopRunRequest<DesktopAction.MAXIMIZE_ACTIVE_WINDOW>
    | DesktopRunRequest<DesktopAction.TAKE_SCREENSHOT, DesktopTakeScreenshotActionInput>
    | DesktopRunRequest<DesktopAction.READ_TEXT_FROM_IMAGE, DesktopReadTextFromImageActionInput>
    | DesktopRunRequest<DesktopAction.PERFORM_KEYBOARD_SHORTCUT, DesktopPerformKeyboardShortcutActionInput>;

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

export interface PointData {
    x: Coordinate;
    y: Coordinate;
}

export interface RegionData {
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

export type DesktopTypeCredentialsActionInput = {
    credentialAttribute: 'username' | 'password';
}

export type DesktopPerformKeyboardShortcutActionInput = {
    shortcut: string;
}

export type DesktopCopyActionInput = {
    text?: string;
}

export type DesktopCursorSelectActionInput = {
    startPoint: any;
    endPoint: any;
}

export type DesktopReadClipboardContentActionOutput = string;

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

export interface DesktopCredential {
    username: string;
    password: string;
}
