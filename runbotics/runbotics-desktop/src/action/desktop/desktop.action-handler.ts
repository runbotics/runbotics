import { StatelessActionHandler } from 'runbotics-sdk';
import { RunboticsLogger } from '#logger';
import {
    mouse,
    keyboard,
    clipboard,
    straightTo,
    MouseConfig,
    KeyboardConfig,
    Point,
    Button,
    Key,
} from '@nut-tree/nut-js';
import { 
    DesktopClickActionInput, 
    DesktopTypeActionInput,
    DesktopReadCursorSelectionActionInput,
    DesktopReadCursorSelectionActionOutput,
    DesktopPasteActionInput,
    DesktopActionRequest
} from './types';

export default class DesktopActionHandler extends StatelessActionHandler {
    private readonly logger: RunboticsLogger = new RunboticsLogger(DesktopActionHandler.name);
    private readonly system: string = process.platform;
    private readonly mouseConfig: MouseConfig = {
        autoDelayMs: 50,
        mouseSpeed: 600,
    };
    private readonly keyboardConfig: KeyboardConfig = {
        autoDelayMs: 50,
    };
    

    constructor() {
        super();
        mouse.config = this.mouseConfig;
        keyboard.config = this.keyboardConfig;
    }

    async click(input: DesktopClickActionInput): Promise<void> {
        this.checkIfNaN(input.x, input.y);

        await this.moveMouse(input.x, input.y);
        if (input.mouseButton.startsWith('L')) {
            await mouse.click(Button.LEFT);
        } else {
            await mouse.click(Button.RIGHT);
        }
    }

    async type(input: DesktopTypeActionInput): Promise<void> {
        this.checkIfNaN(input.x, input.y);
        
        await this.moveMouse(input.x, input.y);
        const optionalKey = input.text.substring(4); 
        if (input.text.startsWith('Key.') && Object.keys(Key).includes(optionalKey)) {
            await keyboard.type(Key[optionalKey]);
        } else {
            await keyboard.type(input.text);
        }
    }

    async readCursorSelection(input: DesktopReadCursorSelectionActionInput): Promise<DesktopReadCursorSelectionActionOutput> {
        this.checkIfNaN(input.startFirstCoordinate, input.startSecondCoordinate);
        this.checkIfNaN(input.endFirstCoordinate, input.endSecondCoordinate);

        await this.moveMouse(input.startFirstCoordinate, input.startSecondCoordinate);
        await mouse.pressButton(Button.LEFT);
        await this.moveMouse(input.endFirstCoordinate, input.endSecondCoordinate);
        await mouse.releaseButton(Button.LEFT);
        if (this.system === 'darwin') {
            await keyboard.pressKey(Key.LeftCmd, Key.C);
            await keyboard.releaseKey(Key.LeftCmd, Key.C);
        } else {
            await keyboard.pressKey(Key.LeftControl, Key.C);
            await keyboard.releaseKey(Key.LeftControl, Key.C);
        }
        const content = await clipboard.getContent();
        return content;
    }

    async paste(input: DesktopPasteActionInput): Promise<void> {
        this.checkIfNaN(input.x, input.y);;

        await this.moveMouse(input.x, input.y);
        await mouse.click(Button.LEFT);
        const content = await clipboard.getContent();
        await keyboard.type(content);
    }

    async maximizeWindow() {
        if (this.system === 'win32') {
            // for Windows:
            await keyboard.pressKey(Key.LeftWin, Key.Up);
            await keyboard.releaseKey(Key.LeftWin, Key.Up);
        } else if (this.system === 'darwin') {
            // for macOS:
            await keyboard.pressKey(Key.LeftCmd, Key.Up);
            await keyboard.releaseKey(Key.LeftCmd, Key.Up);
        } else if (this.system === 'linux') {
            // for Linux (GNOME):
            await keyboard.pressKey(Key.LeftAlt, Key.F10);
            await keyboard.releaseKey(Key.LeftAlt, Key.F10);
        } else {
            throw new Error('Unsupported operating system.');
        }
    }

    private async moveMouse(x: string, y: string) {
        const destination = new Point(Number(x), Number(y));
        await mouse.move(straightTo(destination));
    }

    private checkIfNaN(x: any, y: any) {
        if (isNaN(x) || isNaN(y)) {
            throw new Error('Destination coordinates must be of number type.');
        }
    }

    run(request: DesktopActionRequest) {
        switch (request.script) {
            case 'desktop.click':
                return this.click(request.input);
            case 'desktop.type':
                return this.type(request.input);
            case 'desktop.readCursorSelection':
                return this.readCursorSelection(request.input);
            case 'desktop.paste':
                return this.paste(request.input);
            case 'desktop.maximizeWindow':
                return this.maximizeWindow();
            default:
                throw new Error('Action not found');
        }
    }
}
