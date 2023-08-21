import { DesktopRunRequest } from 'runbotics-sdk';
import { MouseButton } from 'runbotics-common';

export type DesktopActionRequest =
| DesktopRunRequest<'desktop.click', DesktopClickActionInput>
| DesktopRunRequest<'desktop.type', DesktopTypeActionInput>
| DesktopRunRequest<'desktop.readCursorSelection', DesktopReadCursorSelectionActionInput>
| DesktopRunRequest<'desktop.paste', DesktopPasteActionInput>
| DesktopRunRequest<'desktop.maximizeWindow'>;

export type DesktopClickActionInput = {
    x: string;
    y: string;
    mouseButton: MouseButton;
};

export type DesktopTypeActionInput = {
    x: string;
    y: string;
    text: string;
}

export type DesktopReadCursorSelectionActionInput = {
    startFirstCoordinate: string;
    startSecondCoordinate: string;
    endFirstCoordinate: string;
    endSecondCoordinate: string;
}

export type DesktopReadCursorSelectionActionOutput = string;

export type DesktopPasteActionInput = {
    x: string;
    y: string;
}

