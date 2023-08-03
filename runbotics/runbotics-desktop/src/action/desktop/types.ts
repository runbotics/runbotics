import { DesktopRunRequest } from 'runbotics-sdk';

export type DesktopActionRequest =
| DesktopRunRequest<'desktopAutomation.click', DesktopClickActionInput>
| DesktopRunRequest<'desktopAutomation.type', DesktopTypeActionInput>
| DesktopRunRequest<'desktopAutomation.copySelection', DesktopCopySelectionActionInput>
| DesktopRunRequest<'desktopAutomation.paste', DesktopPasteActionInput>
| DesktopRunRequest<'desktopAutomation.maximizeWindow'>;

export enum MouseButton {
    LEFT = 'Left',
    RIGHT = 'Right'
}

export type DesktopClickActionInput = {
    xCoordinate: number;
    yCoordinate: number;
    mouseButton: MouseButton;
};

export type DesktopTypeActionInput = {
    xCoordinate: number;
    yCoordinate: number;
    text: string;
}

export type DesktopCopySelectionActionInput = {
    startPointFirstCoordinate: number;
    startPointSecondCoordinate: number;
    endPointFirstCoordinate: number;
    endPointSecondCoordinate: number;
}

export type DesktopPasteActionInput = {
    xCoordinate: number;
    yCoordinate: number;
}

