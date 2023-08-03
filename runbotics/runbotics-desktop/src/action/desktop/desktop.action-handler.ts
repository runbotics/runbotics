import { StatelessActionHandler } from 'runbotics-sdk';
import { RunboticsLogger } from '#logger';
import {
    mouse,
    keyboard,
    straightTo,
    Point,
    Button,
    Key,
} from '@nut-tree/nut-js';
import * as DesktopTypes from './types';

export default class DesktopActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(DesktopActionHandler.name);

    constructor() {
        super();
    }

    private checkIfNaN(xCoordinate: number, yCoordinate: number) {
        if (isNaN(xCoordinate) || isNaN(yCoordinate)) {
            throw new Error('Element coordinates have to be of type number');
        }
    }

    async click(input: DesktopTypes.DesktopClickActionInput) {
        //this.checkIfNaN(input.xCoordinate, input.yCoordinate);
        mouse.config = {
            autoDelayMs: 20,
            mouseSpeed: 500,
        };

        await mouse.move(
            straightTo(new Point(input.xCoordinate, input.yCoordinate))
        );
        if (input.mouseButton === DesktopTypes.MouseButton.RIGHT) {
            await mouse.click(Button.RIGHT);
        } else {
            await mouse.click(Button.LEFT);
        }
    }

    async type(input: DesktopTypes.DesktopTypeActionInput) {
        // if not of type string then make string
        // this.checkIfNaN(input.xCoordinate, input.yCoordinate);
        mouse.config = {
            autoDelayMs: 50,
            mouseSpeed: 500,
        };
        keyboard.config = {
            autoDelayMs: 50,
        };

        await mouse.move(
            straightTo(new Point(input.xCoordinate, input.yCoordinate))
        );

        const optionalKey = input.text.substring(4); 
        if (input.text.startsWith('Key.') && Object.keys(Key).includes(optionalKey)) {
            await keyboard.type(Key[optionalKey]);
        } else {
            await keyboard.type(input.text);
        }
    }

    async copySelection(input: DesktopTypes.DesktopCopySelectionActionInput) {
        //this.checkIfNaN(input.startPointFirstCoordinate, input.startPointSecondCoordinate);
        //this.checkIfNaN(input.endPointFirstCoordinate, input.endPointSecondCoordinate);

        mouse.config = {
            autoDelayMs: 50,
            mouseSpeed: 500,
        };

        await mouse.move(
            straightTo(new Point(input.startPointFirstCoordinate, input.startPointSecondCoordinate))
        );
        await mouse.pressButton(Button.LEFT);
        await mouse.move(
            straightTo(new Point(input.endPointFirstCoordinate, input.endPointSecondCoordinate))
        );
        await mouse.releaseButton(Button.LEFT);
        await keyboard.pressKey(Key.LeftControl, Key.C);
        await keyboard.releaseKey(Key.LeftControl, Key.C);
    }

    async paste(input: DesktopTypes.DesktopPasteActionInput) {
        //this.checkIfNaN(input.xCoordinate, input.yCoordinate);
        mouse.config = {
            autoDelayMs: 50,
            mouseSpeed: 500,
        };

        await mouse.move(
            straightTo(new Point(input.xCoordinate, input.yCoordinate))
        );
        await mouse.click(Button.LEFT);
        await keyboard.pressKey(Key.LeftControl, Key.V);
        await keyboard.releaseKey(Key.LeftControl, Key.V);
    }

    async maximizeWindow() {
        // for windows:
        await keyboard.pressKey(Key.LeftWin, Key.Up);
        await keyboard.releaseKey(Key.LeftWin, Key.Up);
    }

    run(request: DesktopTypes.DesktopActionRequest) {
        switch (request.script) {
            case 'desktopAutomation.click':
                return this.click(request.input);
            case 'desktopAutomation.type':
                return this.type(request.input);
            case 'desktopAutomation.copySelection':
                return this.copySelection(request.input);
            case 'desktopAutomation.paste':
                return this.paste(request.input);
            case 'desktopAutomation.maximizeWindow':
                return this.maximizeWindow();
            default:
                throw new Error('Action not found');
        }
    }
}
