import fs from 'fs';
import path from 'path';
import { DesktopAction, TEMP_DIRECTORY_NAME } from 'runbotics-common';
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
    PointData,
    RegionData,
    KEY_REFERENCE,
    DesktopPerformKeyboardShortcutActionInput,
    DesktopTypeCredentialsActionInput,
    DesktopCredential
} from './types';
import clipboard from '../../utils/clipboard';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';



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
        const button: Button = input.mouseButton === MouseButton.LEFT ? Button.LEFT : Button.RIGHT;

        if (input.clickTarget === ClickTarget.POINT) {
            const point = input.point;
            this.checkPoint(point);
            this.moveMouseToPoint(point);
        } else {
            const region = input.region;
            this.checkRegion(region);
            await this.moveMouseToRegion(region);
        }

        if (input.doubleClick) {
            await mouse.doubleClick(button);
        } else {
            await mouse.click(button);
        }
    }

    async type(input: DesktopTypeActionInput): Promise<void> {
        if (typeof input.text === 'number') {
            await keyboard.type(`${input.text}`);
            return;
        }

        const optionalKey = input.text.substring(KEY_REFERENCE.length);
        if (input.text.startsWith(KEY_REFERENCE) && Object.keys(Key).includes(optionalKey)) {
            await keyboard.type(Key[optionalKey]);
        } else {
            await keyboard.type(input.text);
        }
    }

    async typeCredentials(
        input: DesktopTypeCredentialsActionInput,
        credential: DesktopCredential,
    ) {
        const credentialAttributeValue = credential[input.credentialAttribute];
        await keyboard.type(credentialAttributeValue);
    }

    async runKeyboardShortcut(input: DesktopPerformKeyboardShortcutActionInput): Promise<void> {
        const shortcutsArr = input.shortcut.split('+');
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

    async copy(input: DesktopCopyActionInput): Promise<void> {
        if (input.text) {
            await clipboard.write(input.text);
        } else {
            const superKey: Key = this.getSuperKey();
            await this.performKeyboardShortcut([superKey, Key.C]);
        }
    }

    async paste(): Promise<void> {
        const superKey: Key = this.getSuperKey();
        await this.performKeyboardShortcut([superKey, Key.V]);
    }

    async cursorSelect(input: DesktopCursorSelectActionInput): Promise<void> {
        this.checkPoint(input.startPoint);
        this.checkPoint(input.endPoint);
        await this.moveMouseToPoint(input.startPoint);
        await mouse.pressButton(Button.LEFT);
        await this.moveMouseToPoint(input.endPoint);
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

    async takeScreenshot(input: DesktopTakeScreenshotActionInput): Promise<DesktopTakeScreenshotActionOutput> {
        // prevents from taking screenshot too fast
        await sleep(500);

        const { imagePath, region, imageName, imageFormat } = input;
        const fileName = imageName ?? uuidv4();
        let filePath: string;

        if (imagePath) {
            filePath = path.normalize(imagePath);
            this.checkFileExist(filePath);
        } else {
            filePath = path.join(process.cwd(), TEMP_DIRECTORY_NAME);
        }

        if (region) {
            this.checkRegion(region);
            const newRegion = new Region(Number(region.left), Number(region.top), Number(region.width), Number(region.height));
            return screen.captureRegion(fileName, newRegion, FileType[imageFormat], filePath);
        } else {
            return screen.capture(fileName, FileType[input.imageFormat], filePath);
        }
    }

    // async findScreenRegion(input: DesktopFindScreenRegionActionInput): Promise<RegionData> {
    //     const image = path.normalize(input.imageFullPath);
    //     this.checkFileExist(image);

    //     const { filePath, fileName } = this.getFilePathElements(image);
    //     screen.config.resourceDirectory = filePath;

    //     const resource = await imageResource(fileName);
    //     const region = await screen.find(resource);
    //     return this.toRegionObj(region);
    // }

    // async waitForScreenRegion(input: DesktopWaitForScreenRegionActionInput): Promise<RegionData> {
    //     const image = path.normalize(input.imageFullPath);
    //     this.checkFileExist(image);

    //     const { filePath, fileName } = this.getFilePathElements(image);
    //     screen.config.resourceDirectory = filePath;

    //     const resource = await imageResource(fileName);
    //     const region = await screen.waitFor(resource, 5000);
    //     return this.toRegionObj(region);
    // }

    async readTextFromImage(input: DesktopReadTextFromImageActionInput): Promise<DesktopReadTextFromImageActionOutput> {
        let worker: any;
        try {
            const { imageFullPath, language } = input;
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

    private async moveMouseToPoint(point: PointData) {
        const destination = new Point(Number(point.x), Number(point.y));
        await mouse.move(straightTo(destination));
    }

    private async moveMouseToRegion(region: RegionData) {
        const destination = new Region(Number(region.left), Number(region.top), Number(region.width), Number(region.height));
        await mouse.move(straightTo(centerOf(destination)));
    }

    private async performKeyboardShortcut(keys: Key[]) {
        await keyboard.pressKey(...keys);
        await keyboard.releaseKey(...keys);
    }

    private getSuperKey(): Key {
        return this.system === 'darwin' ? Key.LeftCmd : Key.LeftControl;
    }

    private checkPoint(point: unknown) {
        if (typeof point !== 'object') {
            throw new Error('Point must be of object type and its coordinates (x, y) must be numeric.');
        }

        const testPoint = new Point(0, 0);
        const pointKeys = Object.keys(testPoint);
        for (const key of pointKeys) {
            if (!(key in point) || isNaN(point[key])) {
                throw new Error('Point coordinates (x, y) must be numeric.');
            }
        }
    }

    private checkRegion(region: unknown) {
        if (typeof region !== 'object') {
            throw new Error('Region must be of object type and its properties (left, top, width, height) must be numeric.');
        }

        const testRegion = new Region(0, 0, 0, 0);
        const regionKeys = Object.keys(testRegion);
        for (const key of regionKeys) {
            if (!(key in region) || isNaN(region[key])) {
                throw new Error('Region properties (left, top, width, height) must be numeric.');
            }
        }
    }

    private checkFileExist(filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new Error('Provided path does not exist');
        }
    }

    private getFilePathElements(filePath: string): { filePath: string; fileName: string, fileExtension: string } {
        const parsedPath = path.parse(filePath);
        return {
            filePath: parsedPath.dir,
            fileName: parsedPath.name + parsedPath.ext,
            fileExtension: parsedPath.ext
        };
    }

    private toRegionObj(region: Region): RegionData {
        return {
            left: region.left,
            top: region.top,
            width: region.width,
            height: region.height
        };
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
