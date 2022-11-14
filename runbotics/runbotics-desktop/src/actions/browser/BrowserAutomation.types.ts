import { DesktopRunRequest } from 'runbotics-sdk';

export type BrowserActionRequest<I> = DesktopRunRequest<any> & {
    script:
        | 'browser.selenium.select'
        | 'browser.selenium.open'
        | 'browser.selenium.type'
        | 'browser.selenium.click'
        | 'browser.selenium.wait'
        | 'browser.launch'
        | 'browser.index'
        | 'browser.selenium.printToPdf'
        | 'browser.selenium.takeScreenshot'
        | 'browser.selenium.elements.count'
        | 'browser.selenium.element.attribute.change'
        | 'browser.close'
        | 'browser.read.attribute'
        | 'browser.read.text'
        | 'browser.read.input';
};

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
    target: 'Url' | 'Session';
    url?: string;
};

export type BrowserPrintToPdfActionOutput = string;

export type BrowserTakeScreenshotActionOutput = string;
