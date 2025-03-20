import { DesktopRunRequest } from '@runbotics/runbotics-sdk';

export type BrowserActionRequest =
| DesktopRunRequest<'browser.launch', BrowserLaunchActionInput>
| DesktopRunRequest<'browser.close', never>
| DesktopRunRequest<'browser.index', BrowserIndexActionInput>
| DesktopRunRequest<'browser.selenium.select', BrowserActionInput>
| DesktopRunRequest<'browser.selenium.open', BrowserOpenActionInput>
| DesktopRunRequest<'browser.selenium.type', BrowserActionInput>
| DesktopRunRequest<'browser.selenium.click', BrowserActionInput>
| DesktopRunRequest<'browser.selenium.wait', BrowserActionInput>
| DesktopRunRequest<'browser.selenium.printToPdf', BrowserPrintToPdfActionInput>
| DesktopRunRequest<'browser.selenium.takeScreenshot', BrowserScreenshotElementInput>
| DesktopRunRequest<'browser.selenium.elements.count', BrowserCountElementsInput>
| DesktopRunRequest<'browser.selenium.element.attribute.change', BrowserElementAttributeChangeInput>
| DesktopRunRequest<'browser.read.attribute', BrowserReadElementAttribute>
| DesktopRunRequest<'browser.read.text', BrowserReadElementText>
| DesktopRunRequest<'browser.read.input', BrowserReadElementInput>
| DesktopRunRequest<'browser.selenium.insertCredentials', BrowserInsertCredentials>

export type BrowserLaunchActionInput = {
    headless: boolean;
    target?: string;
};

export type BrowserOpenActionInput = {
    target: string;
};

export type BrowserScreenshotElementInput = {
    target?: string;
};

export type BrowserOpenActionOutput = any;

export type BrowserActionInput = {
    target: string;
    value: any;
    clear?: boolean
};
export type BrowserClickActionOutput = any;

export type BrowserIndexActionInput = {
    jsonConfiguration: string;
    headless: boolean;
};
export type BrowserIndexActionOutput = any[];

export type BrowserCountElementsInput = {
    target: string;
};
export type BrowserCountElementsOutput = {
    elementsCount: number;
};

export type BrowserElementAttributeChangeInput = {
    target: string;
    attribute: string;
    newValue: string;
};

export type BrowserReadElementAttribute = {
    target: string;
    attribute: string;
};

export type BrowserReadElementText = {
    target: string;
    textField: string;
};

export type BrowserReadElementInput = {
    target: string;
};

export type BrowserPrintToPdfActionInput = {
    target: 'URL' | 'Session';
    url?: string;
};

export type BrowserPrintToPdfActionOutput = string;

export type BrowserTakeScreenshotActionOutput = string;

export type BrowserInsertCredentials = {
    loginTarget: string
    passwordTarget: string
    submitButtonTarget: string
}

export type BrowserLoginCredential = {
    login: string;
    password: string;
}