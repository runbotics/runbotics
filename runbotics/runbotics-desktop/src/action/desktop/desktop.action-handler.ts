require('@nut-tree/template-matcher');
import fs from 'fs';
import path from 'path';
import { StatelessActionHandler } from 'runbotics-sdk';
import { RunboticsLogger } from '#logger';
import { v4 as uuidv4 } from 'uuid';
import { createWorker } from 'tesseract.js';
import {
    mouse,
    keyboard,
    clipboard,
    screen,
    straightTo,
    centerOf,
    sleep,
    imageResource,
    MouseConfig,
    KeyboardConfig,
    Point,
    Button,
    Key,
    Region,
    FileType,
} from '@nut-tree/nut-js';
import {
    DesktopActionRequest,
    DesktopClickActionInput, 
    DesktopTypeActionInput,
    DesktopCopyActionInput,
    DesktopSelectWithCursorActionInput,
    DesktopReadContentFromClipboardActionOutput,
    DesktopFindScreenRegionActionInput,
    DesktopWaitForScreenRegionActionInput,
    DesktopTakeScreenshotActionInput,
    DesktopTakeScreenshotActionOutput,
    DesktopReadTextFromImageActionInput,
    DesktopReadTextFromImageActionOutput,
    ClickTarget,
    Coordinate,
    MouseButton,
    RegionObj
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
    // screen config -> configure directory for imageResource
    
    constructor() {
        super();
        mouse.config = this.mouseConfig;
        keyboard.config = this.keyboardConfig;
    }

    async click(input: DesktopClickActionInput): Promise<void> {
        const button: Button = input.mouseButton === MouseButton.LEFT ? Button.LEFT : Button.RIGHT;
        
        if (input.clickTarget === ClickTarget.POINT) {
            this.checkPoint(input.x, input.y);
            this.moveMouseToPoint(input.x, input.y);
        } else {
            const region = input.region;
            this.checkRegion(region);
            await this.moveMouseToRegion(+region.left, +region.top, +region.width, +region.height);
        }
        
        if (input.doubleClick) {
            await mouse.doubleClick(button);
        } else {
            await mouse.click(button);
        }
    }

    async type(input: DesktopTypeActionInput): Promise<void> {
        const optionalKey = input.text.substring(4); 
        if (input.text.startsWith('Key.') && Object.keys(Key).includes(optionalKey)) {
            await keyboard.type(Key[optionalKey]);
        } else {
            await keyboard.type(input.text);
        }
    }

    async copy(input: DesktopCopyActionInput): Promise<void> {
        if (input?.text) {
            await clipboard.setContent(input.text);
        } else {
            const superKey: Key = this.getSuperKey();
            await this.performKeyboardShortcut([superKey, Key.C]);
        } 
    }

    async paste(): Promise<void> {
        const content = await clipboard.getContent();
        await keyboard.type(content);
    }

    async selectWithCursor(input: DesktopSelectWithCursorActionInput): Promise<void> {
        this.checkPoint(input.startX, input.startY);
        this.checkPoint(input.endX, input.endY);
        await this.moveMouseToPoint(input.startX, input.startY);
        await mouse.pressButton(Button.LEFT);
        await this.moveMouseToPoint(input.endX, input.endY);
        await mouse.releaseButton(Button.LEFT);
    }

    async readContentFromClipboard(): Promise<DesktopReadContentFromClipboardActionOutput> {
        const content = await clipboard.getContent();
        return content;
    }

    async takeScreenshot(input: DesktopTakeScreenshotActionInput): Promise<DesktopTakeScreenshotActionOutput> {
        // prevents from taking screenshot too fast
        await sleep(2000);
        const region = input?.region;
        const fileName = input?.fileName ?? uuidv4();
        const filePath = input?.filePath ?? path.join(process.cwd(), 'temp');
        let imagePath: string;

        if (region) {
            this.checkRegion(region);
            const newRegion = new Region(+region.left, +region.top, +region.width, +region.height);
            imagePath = await screen.captureRegion(fileName, newRegion, FileType[input.fileFormat], filePath);
        } else {
            imagePath = await screen.capture(fileName, FileType[input.fileFormat], filePath);
        }
        return imagePath;
    }

    async findScreenRegion(input: DesktopFindScreenRegionActionInput): Promise<RegionObj> {
        const image = input.imagePath;
        this.checkImageExtension(image);

        try {
            const resource = await imageResource(image);
            const region = await screen.find(resource); //optional param?
            return this.toRegionObj(region);
        } catch (error) {
            throw new Error(error);
        }
    }

    async waitForScreenRegion(input: DesktopWaitForScreenRegionActionInput): Promise<RegionObj> {
        const image = input.imagePath;
        this.checkImageExtension(image);

        try {
            const resource = await imageResource(image);
            const region = await screen.waitFor(resource, 5000);
            return this.toRegionObj(region);
        } catch (error) {
            throw new Error(error);
        }
    }

    async readTextFromImage(input: DesktopReadTextFromImageActionInput): Promise<DesktopReadTextFromImageActionOutput> {
        try {
            const imageBuffer = fs.readFileSync(input.imagePath);

            const worker = await createWorker();
            await worker.loadLanguage(input.language);
            await worker.initialize(input.language);
    
            const { data: { text } } = await worker.recognize(imageBuffer);
            await worker.terminate();

            return text;
        } catch (error) {
            throw new Error(error);
        }
    }

    // async readCursorSelection(input: DesktopReadCursorSelectionActionInput): Promise<DesktopReadCursorSelectionActionOutput> {
    //     this.checkPoint(input.startFirstCoordinate, input.startSecondCoordinate);
    //     this.checkPoint(input.endFirstCoordinate, input.endSecondCoordinate);

    //     await this.moveMouse(input.startFirstCoordinate, input.startSecondCoordinate);
    //     await mouse.pressButton(Button.LEFT);
    //     await this.moveMouse(input.endFirstCoordinate, input.endSecondCoordinate);
    //     await mouse.releaseButton(Button.LEFT);
    //     if (this.system === 'darwin') {
    //         await keyboard.pressKey(Key.LeftCmd, Key.C);
    //         await keyboard.releaseKey(Key.LeftCmd, Key.C);
    //     } else {
    //         await keyboard.pressKey(Key.LeftControl, Key.C);
    //         await keyboard.releaseKey(Key.LeftControl, Key.C);
    //     }
    //     const content = await clipboard.getContent();
    //     return content;
    // }

    async maximizeActiveWindow(): Promise<void> {
        if (this.system === 'win32') {
            // for Windows:
            await this.performKeyboardShortcut([Key.LeftWin, Key.Up]);
        } else if (this.system === 'darwin') {
            // for macOS:
            await this.performKeyboardShortcut([Key.LeftCmd, Key.Up]);
        } else if (this.system === 'linux') {
            // for Linux (GNOME):
            await this.performKeyboardShortcut([Key.LeftAlt, Key.F10]);
        } else {
            throw new Error('Unsupported operating system.');
        }
    }

    private async moveMouseToPoint(x: Coordinate, y: Coordinate) {
        const destination = new Point(+x, +y);
        await mouse.move(straightTo(destination));
    }

    private async moveMouseToRegion(left: Coordinate, top: Coordinate, width: Coordinate, height: Coordinate) {
        const destination = new Region(+left, +top, +width, +height);
        await mouse.move(straightTo(centerOf(destination)));
    }

    private async performKeyboardShortcut(keys: Key[]) {
        await keyboard.pressKey(...keys);
        await keyboard.releaseKey(...keys);
    }

    private getSuperKey(): Key {
        return this.system === 'darwin' ? Key.LeftCmd : Key.LeftControl;
    }

    private checkPoint(x: Coordinate, y: Coordinate) {
        if (isNaN(+x) || isNaN(+y)) {
            throw new Error('Destination coordinates must be of number type');
        }
    }

    private checkRegion(region: any) {
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

    private checkImageExtension(image: string) {
        const extension = image.substring(image.length - 4);
        if (extension !== FileType.JPG && extension !== FileType.PNG) {
            throw new Error('Unsuporrted image format');
        }
    }

    private toRegionObj(region: Region): RegionObj {
        return { left: region.left, top: region.top, width: region.width, height: region.height };
    }

    run(request: DesktopActionRequest) {
        switch (request.script) {
            case 'desktop.click':
                return this.click(request.input);
            case 'desktop.type':
                return this.type(request.input);
            case 'desktop.copy':
                return this.copy(request.input);
            case 'desktop.paste':
                return this.paste();
            case 'desktop.selectWithCursor':
                return this.selectWithCursor(request.input);
            case 'desktop.readContentFromClipboard':
                return this.readContentFromClipboard();
            case 'desktop.maximizeActiveWindow':
                return this.maximizeActiveWindow();
            case 'desktop.findScreenRegion':
                return this.findScreenRegion(request.input);
            case 'desktop.waitForScreenRegion':
                return this.waitForScreenRegion(request.input);
            case 'desktop.takeScreenshot':
                return this.takeScreenshot(request.input);
            case 'desktop.readTextFromImage':
                return this.readTextFromImage(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
