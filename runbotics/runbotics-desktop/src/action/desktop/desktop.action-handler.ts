import fs from 'fs';
import path from 'path';
import { DesktopAction } from 'runbotics-common';
import { v4 as uuidv4 } from 'uuid';
import { createWorker } from 'tesseract.js';

import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import {
    mouse,
    keyboard,
    screen,
    straightTo,
    centerOf,
    sleep,
    MouseConfig,
    KeyboardConfig,
    Point,
    Button,
    Key,
    Region,
    FileType,
} from '@runbotics/nut-js';

import { RunboticsLogger } from '#logger';

import {
    DesktopActionRequest,
    DesktopClickActionInput,
    DesktopTypeActionInput,
    DesktopCopyActionInput,
    DesktopCursorSelectActionInput,
    DesktopReadClipboardContentActionOutput,
    DesktopTakeScreenshotActionInput,
    DesktopTakeScreenshotActionOutput,
    DesktopReadTextFromImageActionInput,
    DesktopReadTextFromImageActionOutput,
    ClickTarget,
    MouseButton,
    KEY_REFERENCE,
    DesktopPerformKeyboardShortcutActionInput,
    DesktopTypeCredentialsActionInput,
    DesktopCredential,
    isPointDataType,
    PointData,
    RegionData,
} from './types';
import clipboard from '../../utils/clipboard';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import { validateInput } from '#utils/zodError';
import { ServerConfigService } from '#config';
import { Injectable } from '@nestjs/common';
import { clickInputSchema, typeInputSchema, performKeyboardShortcutInputSchema, copyInputSchema, cursorSelectInputSchema, takeScreenshotInputSchema, readTextFromImageInputSchema, typeCredentialsInputSchema } from './desktop.utils';

@Injectable()
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
    private readonly tempFolderPath: string;

    constructor(
        private readonly serverConfigService: ServerConfigService
    ) {
        super();
        mouse.config = this.mouseConfig;
        keyboard.config = this.keyboardConfig;
        this.tempFolderPath = this.serverConfigService.tempFolderPath;
    }

    async click(rawInput: DesktopClickActionInput): Promise<void> {
        const { clickTarget, point, region, mouseButton, doubleClick } = await validateInput(rawInput, clickInputSchema);

        const button: Button = mouseButton === MouseButton.LEFT ? Button.LEFT : Button.RIGHT;

        const target: PointData | RegionData = (clickTarget === ClickTarget.POINT) ? this.parseTarget(point) : this.parseTarget(region);

        this.checkTarget(target, clickTarget);


        await this.moveMouse(target);

        if (doubleClick) {
            await mouse.doubleClick(button);
        } else {
            await mouse.click(button);
        }
    }

    async type(rawInput: DesktopTypeActionInput): Promise<void> {
        const { text } = await validateInput(rawInput, typeInputSchema);

        if (typeof text === 'number') {
            await keyboard.type(`${text}`);
            return;
        }

        const optionalKey = text.substring(KEY_REFERENCE.length);
        if (text.startsWith(KEY_REFERENCE) && Object.keys(Key).includes(optionalKey)) {
            await keyboard.type(Key[optionalKey]);
        } else {
            await keyboard.type(text);
        }
    }

    async typeCredentials(
        rawInput: DesktopTypeCredentialsActionInput,
        credential: DesktopCredential,
    ) {
        const { credentialAttribute } = await validateInput(rawInput, typeCredentialsInputSchema);
        const credentialAttributeValue = credential[credentialAttribute];
        await keyboard.type(credentialAttributeValue);
    }

    async runKeyboardShortcut(rawInput: DesktopPerformKeyboardShortcutActionInput): Promise<void> {
        const { shortcut } = await validateInput(rawInput, performKeyboardShortcutInputSchema);

        const shortcutsArr = shortcut.split('+');
        const keysToPress = shortcutsArr.map(key => {
            const trimmedKey = key.trim();
            if (Object.keys(Key).includes(trimmedKey)) {
                return Key[trimmedKey];
            } else {
                throw new Error('Unsupported key. Got: ' + trimmedKey + '. Check tooltip for supported keys.');
            }
        });

        await this.performKeyboardShortcut(keysToPress);
    }

    async copy(rawInput: DesktopCopyActionInput): Promise<void> {
        const { text } = await validateInput(rawInput, copyInputSchema);

        if (text) {
            await clipboard.write(text);
        } else {
            const superKey: Key = this.getSuperKey();
            await this.performKeyboardShortcut([superKey, Key.C]);
        }
    }

    async paste(): Promise<void> {
        const superKey: Key = this.getSuperKey();
        await this.performKeyboardShortcut([superKey, Key.V]);
    }

    async cursorSelect(rawInput: DesktopCursorSelectActionInput): Promise<void> {
        const { startPoint, endPoint } = await validateInput(rawInput, cursorSelectInputSchema);

        const parsedStartPoint = this.parseTarget(startPoint);
        const parsedEndPoint = this.parseTarget(endPoint);

        await this.moveMouse(parsedStartPoint);
        await mouse.pressButton(Button.LEFT);
        await this.moveMouse(parsedEndPoint);
        await mouse.releaseButton(Button.LEFT);
    }

    async readClipboardContent(): Promise<DesktopReadClipboardContentActionOutput> {
        try {
            const content = await clipboard.read();
            return content;
        } catch (error) {
            throw new Error('Non-text clipboard content is not supported');
        }
    }

    async takeScreenshot(rawInput: DesktopTakeScreenshotActionInput): Promise<DesktopTakeScreenshotActionOutput> {
        // prevents from taking screenshot too fast
        await sleep(500);

        const { imagePath, region, imageName, imageFormat } = await validateInput(rawInput, takeScreenshotInputSchema);

        const fileName = imageName ?? uuidv4();
        let filePath: string;

        if (imagePath) {
            filePath = path.normalize(imagePath);
            this.checkFileExist(filePath);
        } else {
            filePath = this.tempFolderPath;
        }

        if (region) {
            const parsedRegion = this.parseTarget(region);
            this.checkTarget(parsedRegion, ClickTarget.REGION);
            const newRegion = new Region(Number(parsedRegion.left), Number(parsedRegion.top), Number(parsedRegion.width), Number(parsedRegion.height));
            return screen.captureRegion(fileName, newRegion, FileType[imageFormat], filePath);
        } else {
            return screen.capture(fileName, FileType[imageFormat], filePath);
        }
    }

    async readTextFromImage(rawInput: DesktopReadTextFromImageActionInput): Promise<DesktopReadTextFromImageActionOutput> {
        const { imageFullPath, language } = await validateInput(rawInput, readTextFromImageInputSchema);

        let worker: any;
        try {
            this.checkFileExist(imageFullPath);
            const imageBuffer = fs.readFileSync(imageFullPath);

            worker = await createWorker({ langPath: '.\\trained_data' });
            await worker.loadLanguage(language);
            await worker.initialize(language);
            const { data: { text } } = await worker.recognize(imageBuffer);

            return text;
        } catch (error) {
            throw new Error('An error occurred while reading data from the image. ' + error);
        } finally {
            await worker?.terminate();
        }
    }

    async maximizeActiveWindow(): Promise<void> {
        if (this.system === 'win32') {
            // for Windows:
            await this.performKeyboardShortcut([Key.LeftWin, Key.Up]);
        } else if (this.system === 'darwin') {
            // for macOS:
            await this.performKeyboardShortcut([Key.Fn, Key.F]);
        } else if (this.system === 'linux') {
            // for Linux (GNOME):
            await this.performKeyboardShortcut([Key.LeftAlt, Key.F10]);
        } else {
            throw new Error('Unsupported operating system.');
        }
    }

    private async moveMouse(target: PointData | RegionData) {
        if (isPointDataType(target)) {
            const destination = new Point(Number(target.x), Number(target.y));
            await mouse.move(straightTo(destination));
        } else {
            const destination = new Region(Number(target.left), Number(target.top), Number(target.width), Number(target.height));
            await mouse.move(straightTo(centerOf(destination)));
        }
    }

    private async performKeyboardShortcut(keys: Key[]) {
        await keyboard.pressKey(...keys);
        await keyboard.releaseKey(...keys);
    }

    private getSuperKey(): Key {
        return this.system === 'darwin' ? Key.LeftCmd : Key.LeftControl;
    }

    private parseStringCoordinateToObject (input: string) {
        const validJson = input.replace(/(\w+)\s*:/g, '"$1":');

        try {
            const parsedObject = JSON.parse(validJson);
            return parsedObject;
        } catch (error) {
            throw new Error(`Provided input ${input} is not a valid object. Object properties must be separated by coma and must be numeric.`);
        }
    }

    private parseTarget(target: unknown) {
        if (typeof target !== 'string' && typeof target !== 'object') {
            throw new Error('Invalid input, it should be an object with two attributes - x, y, e.g. { x: 25, y: 298 }');
        }

        const object = typeof target === 'object' ? target : this.parseStringCoordinateToObject(target);

        return object;
    }

    private checkTarget(object: object, targetType: ClickTarget) {
        const testingObject = targetType === ClickTarget.POINT ? new Point(0, 0) : new Region(0, 0, 0, 0);

        this.isTargetObjectValid(object, testingObject);
    }

    private isTargetObjectValid(targetObject: object, testingObject: Point | Region) {
        const isInvalid = Object.keys(testingObject).some(
            (key) => !(key in targetObject) || typeof targetObject[key] !== 'number' || isNaN(targetObject[key])
        );

        if (isInvalid) {
            throw new Error('Object properties must be numeric.');
        }
    }

    private checkFileExist(filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new Error('Provided path does not exist');
        }
    }

    private getCurrentDateForFilePath(): string {
        const now = new Date();

        return now
            .toISOString()
            .replace(/T/g, '_')
            .replace(/:/g, '-')
            .split('.')[0];
    }

    run(request: DesktopActionRequest) {
        switch (request.script) {
            case DesktopAction.CLICK:
                return this.click(request.input);
            case DesktopAction.TYPE:
                return this.type(request.input);
            case DesktopAction.TYPE_CREDENTIALS: {
                const credential = credentialAttributesMapper<DesktopCredential>(request.credentials);
                return this.typeCredentials(request.input, credential);
            }
            case DesktopAction.PERFORM_KEYBOARD_SHORTCUT:
                return this.runKeyboardShortcut(request.input);
            case DesktopAction.COPY:
                return this.copy(request.input);
            case DesktopAction.PASTE:
                return this.paste();
            case DesktopAction.CURSOR_SELECT:
                return this.cursorSelect(request.input);
            case DesktopAction.READ_CLIPBOARD_CONTENT:
                return this.readClipboardContent();
            case DesktopAction.MAXIMIZE_ACTIVE_WINDOW:
                return this.maximizeActiveWindow();
            case DesktopAction.TAKE_SCREENSHOT:
                return this.takeScreenshot(request.input);
            case DesktopAction.READ_TEXT_FROM_IMAGE:
                return this.readTextFromImage(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
