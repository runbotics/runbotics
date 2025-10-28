import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { DesktopAction } from 'runbotics-common';
import z from 'zod';
import {
    clickInputSchema,
    copyInputSchema,
    cursorSelectInputSchema,
    performKeyboardShortcutInputSchema,
    pointDataSchema,
    readTextFromImageInputSchema,
    readTextFromPdfInputSchema,
    regionDataSchema,
    takeScreenshotInputSchema,
    typeCredentialsInputSchema,
    typeInputSchema,
} from './desktop.utils';

export const KEY_REFERENCE = 'Key.';

export type DesktopActionRequest =
    | DesktopRunRequest<DesktopAction.CLICK, DesktopClickActionInput>
    | DesktopRunRequest<DesktopAction.TYPE, DesktopTypeActionInput>
    | DesktopRunRequest<
          DesktopAction.TYPE_CREDENTIALS,
          DesktopTypeCredentialsActionInput
      >
    | DesktopRunRequest<DesktopAction.COPY, DesktopCopyActionInput>
    | DesktopRunRequest<DesktopAction.PASTE>
    | DesktopRunRequest<
          DesktopAction.CURSOR_SELECT,
          DesktopCursorSelectActionInput
      >
    | DesktopRunRequest<DesktopAction.READ_CLIPBOARD_CONTENT>
    | DesktopRunRequest<DesktopAction.MAXIMIZE_ACTIVE_WINDOW>
    | DesktopRunRequest<
          DesktopAction.TAKE_SCREENSHOT,
          DesktopTakeScreenshotActionInput
      >
    | DesktopRunRequest<
          DesktopAction.READ_TEXT_FROM_IMAGE,
          DesktopReadTextFromImageActionInput
      > |
    DesktopRunRequest<
          DesktopAction.READ_TEXT_FROM_PDF,
          DesktopReadTextFromPdfActionInput
      >
    | DesktopRunRequest<
          DesktopAction.PERFORM_KEYBOARD_SHORTCUT,
          DesktopPerformKeyboardShortcutActionInput
      >;

export enum MouseButton {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

export enum ClickTarget {
    POINT = 'Point',
    REGION = 'Region',
}

export enum ImageResourceFormat {
    PNG = 'PNG',
    JPG = 'JPG',
}

export enum Language {
    EN = 'ENG',
    PL = 'POL',
    DE = 'DEU',
}

export type Coordinate = string | number;

export type PointData = z.infer<typeof pointDataSchema>;

export type RegionData = z.infer<typeof regionDataSchema>;

export type DesktopClickActionInput = z.infer<typeof clickInputSchema>;

export type DesktopTypeActionInput = z.infer<typeof typeInputSchema>;

export enum CredentialAttribute {
    USERNAME = 'username',
    PASSWORD = 'password',
}

export interface DesktopCredential {
    username: string;
    password: string;
}

export type DesktopTypeCredentialsActionInput = z.infer<
    typeof typeCredentialsInputSchema
>;

export type DesktopPerformKeyboardShortcutActionInput = z.infer<
    typeof performKeyboardShortcutInputSchema
>;

export type DesktopCopyActionInput = z.infer<typeof copyInputSchema>;

export type DesktopCursorSelectActionInput = z.infer<
    typeof cursorSelectInputSchema
>;

export type DesktopReadClipboardContentActionOutput = string;

export type DesktopTakeScreenshotActionInput = z.infer<
    typeof takeScreenshotInputSchema
>;

export type DesktopTakeScreenshotActionOutput = string;

export type DesktopReadTextFromImageActionInput = z.infer<
    typeof readTextFromImageInputSchema
>;
export type DesktopReadTextFromPdfActionInput = z.infer<
    typeof readTextFromPdfInputSchema
>;

export type DesktopReadTextFromImageActionOutput = string;

export type DesktopReadTextFromPdfActionOutput = string;

export const isPointDataType = (
    object: PointData | RegionData
): object is PointData => {
    return (<PointData>object).x !== undefined;
};

export const isRegionDataType = (
    object: PointData | RegionData
): object is RegionData => {
    return (<RegionData>object).left !== undefined;
};

export interface ParsedOCRWord {
    text: string;
    confidence: number;
    bbox: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    };
    id: string;
    pageNumber: number;
}

export interface ParsedOCRLine {
    text: string;
    confidence: number;
    words: ParsedOCRWord[];
    bbox: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
    };
    pageNumber: number;
}

export interface ParsedOCRPage {
    pageNumber: number;
    lines: ParsedOCRLine[];
    fullText: string;
    averageConfidence: number;
}

export interface ParsedOCRResult {
    pages: ParsedOCRPage[];
    fullText: string;
    totalAverageConfidence: number;
}

export interface RawHOCRResult {
    hocr: string;
    pageDimensions: {
        height: number;
        width: number;
    };
}