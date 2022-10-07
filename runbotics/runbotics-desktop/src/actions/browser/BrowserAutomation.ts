import { writeFileSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { DesktopRunRequest, StatelessActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';
import * as firefox from 'selenium-webdriver/firefox';
import { RunIndex } from './IndexAction';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import Prince from "prince";
import Puppeteer from 'puppeteer';

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
    | 'browser.close';
};

export type BrowserLaunchActionInput = {
    headless: boolean;
    target?: string;
};

export type BrowserOpenActionInput = {
    target: string;
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

export type BrowserPrintToPdfActionInput = {
    target: "Url" | "Session";
    url?: string;
};

export type BrowserPrintToPdfActionOutput = string;

export type BrowserTakeScreenshotActionOutput = string;

@Injectable()
class BrowserAutomation extends StatefulActionHandler {
    private readonly logger = new RunboticsLogger(BrowserAutomation.name);

    session: WebDriver;

    constructor() {
        super();
    }

    async launchBrowser(input: BrowserLaunchActionInput): Promise<any> {
        const current = await this.session?.getSession();
        if (this.session || current) {
            try {
                await this.session.quit();
            } catch (e) {
                this.logger.error('Error closing session');
            } finally {
                this.session = null;
            }
        }
        const driversPath = process.cwd();
        const geckoDriver = driversPath + '/' + process.env['CFG_GECKO_DRIVER'];
        const isWin = process.platform === 'win32';
        this.logger.log('geckoDriver', geckoDriver);
        this.logger.log('isWin', isWin);

        process.env['PATH'] = process.env['PATH'] + (isWin ? ';' : ':') + geckoDriver;
        this.logger.log('Path', process.env['PATH']);
        let optionsFF = new firefox.Options()
            .setPreference('xpinstall.signatures.required', false)
            .setPreference('devtools.console.stdout.content', true)
            .setBinary(process.env['CFG_FIREFOX_BIN']);

        if (input.headless) {
            optionsFF = optionsFF.headless();
        }

        this.session = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(optionsFF)
            .setFirefoxService(
                new firefox.ServiceBuilder()
                    //.enableVerboseLogging()
                    .setStdio('inherit'),
            )
            .build();
            if(input.target) {
                this.openSite({
                    target: input.target
                })
            }
    }

    async closeBrowser(request: BrowserActionRequest<any>): Promise<any> {
        await this.session?.quit();
        this.session = null;
    }

    async openSite(input: BrowserOpenActionInput): Promise<BrowserOpenActionOutput> {
        // process.env['PATH'] = process.env['PATH'] + ':' + process.env['CFG_CHROME_DRIVER'];
        //
        // let driver = await new Builder().forBrowser('chrome').build();
        await this.session.get(input.target);

        return {};
    }

    async run(request: BrowserActionRequest<any>): Promise<DesktopRunResponse<any>> {
        let output = {};
        try {
            switch (request.script) {
                case 'browser.launch':
                    output = await this.launchBrowser(request.input);
                    break;
                case 'browser.close':
                    output = await this.closeBrowser(request);
                    break;
                case 'browser.selenium.open':
                    output = await this.openSite(request.input);
                    break;
                case 'browser.selenium.type':
                    output = await this.doType(request.input);
                    break;
                case 'browser.selenium.click':
                    output = await this.doClick(request.input);
                    break;
                case 'browser.selenium.wait':
                    output = await this.doWait(request.input);
                    break;
                case 'browser.selenium.select':
                    output = await this.doSelect(request.input);
                    break;
                case 'browser.selenium.printToPdf':
                    output = await this.printToPdf(request.input);
                    break;
                case 'browser.selenium.takeScreenshot':
                    output = await this.takeScreenshot();
                    break;
                case 'browser.index':
                    output = await this.doIndex(request.input);
                    break;
                case 'browser.selenium.elements.count':
                    output = await this.countElements(request.input);
                    break;
                case 'browser.selenium.element.attribute.change':
                    output = await this.elementAttributeChange(request.input);
                    break;
                default:
            }
        } catch (e) {
            this.logger.error('Error in browser autoatmion', e);
            throw e;
        }
        return {
            status: 'ok',
            output: output,
        };
    }

    private async elementAttributeChange(input: BrowserElementAttributeChangeInput): Promise<BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        this.session.executeScript(
            'arguments[0].setAttribute(arguments[1], arguments[2])',
            element,
            input.attribute,
            input.newValue,
        );

        return {};
    }

    private async countElements(input: BrowserCountElementsInput): Promise<BrowserCountElementsOutput> {
        const locator: any = {};
        const [key, ...rest] = input.target.split('=');
        locator[key] = rest.join('=');

        return this.session
            .wait(until.elementsLocated(locator), 10000)
            .then((response) => ({ elementsCount: response.length }))
            .catch(() => ({ elementsCount: 0 }));
    }

    private async doClick(input: BrowserActionInput): Promise<BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        await element.click();
        return {};
    }

    private async doWait(input: BrowserActionInput): Promise<BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        this.logger.log('doWait', element);
        return {};
    }

    private async doType(input: BrowserActionInput): Promise<BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        await element.sendKeys(input.value);

        return {};
    }

    async findElement(target: string): Promise<WebElement> {
        const locator: any = {};
        const [key, ...rest] = target.split('=');

        locator[key] = rest.join('=');
        let element = await this.session.wait(until.elementLocated(locator), 10000);
        return element;
    }


    private async doSelect(input: BrowserActionInput): Promise<BrowserClickActionOutput> {
        // const element = this.session.findElement(locator);
        const element = await this.findElement(input.target);
        const qualifiedName = input.value.split('=')[0];
        const optionValue = input.value.split('=')[1];
        if (qualifiedName == 'value') {
            const select = await element.findElement(By.css('option[value="' + optionValue + '"]'));
            if (select) {
                await select.click();
            }
        } else {
            const options = await element.findElements(By.css('option'));
            for (let option of options) {
                const text = await option.getText();
                if (text === optionValue) {
                    await option.click();
                    break;
                }
            }
        }

        // const result = await this.session.executeScript(
        //     function([element, value]) {
        //         const qualifiedName = value.split('=')[0]
        //         const elementValue = value.split('=')[1]
        //         element.setAttribute(qualifiedName, elementValue)
        //     }, [element, input.value])

        return {};
    }

    private async doIndex(input: BrowserIndexActionInput): Promise<BrowserIndexActionOutput> {
        try {
            const result = await RunIndex(this.session, input.jsonConfiguration);
            return result;
        } catch (e) {
            this.logger.error('error doindex', e);
            throw e;
        }
    }

    private async takeScreenshot(): Promise<BrowserTakeScreenshotActionOutput> {
        const fileName = `${process.cwd()}\\temp\\${uuidv4()}.png`.replace(/\\\\/g, '\\');;
        try {
            const image = await this.session.takeScreenshot();
            writeFileSync(`${fileName}`, image, { encoding: 'base64' });
            return fileName
        } catch (e) {
            this.logger.log('Error occured while taking screenshot', e);
            throw e;
        }
    }

    private async printToPdf(input: BrowserPrintToPdfActionInput): Promise<BrowserPrintToPdfActionOutput> {
        const fileName = `${process.cwd()}\\temp\\${uuidv4()}`.replace(/\\\\/g, '\\');
        if (input.target === 'Session') {
            const source: string = await this.session?.executeScript('return document.body.outerHTML');
            writeFileSync(`${fileName}.html`, source, { encoding: 'utf8' });
            await Prince()
                .inputs(`${fileName}.html`)
                .output(`${fileName}.pdf`)
                .execute();
            return `${fileName}.pdf`;
        }
        if (input.target === 'Url' && input.url) {
            this.logger.log('Printing to pdf', input.url);
            // assigning browser to variable to before try/catch block 
            // because it is not available in try/catch block
            const browser = await Puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ]
            }).catch((e) => {
                this.logger.error('error puppeteer', e);
                throw e;
            });

            try {
                const page = await browser.newPage();
                await page.goto(input.url, {
                    waitUntil: ['load', 'networkidle0'], // wait for page to load completely
                });
                await page.pdf({
                    path: `${fileName}.pdf`,
                    format: 'A4',
                })
            } catch (e) {
                this.logger.error("error while generating pdf", e);
                throw e
            } finally {
                await browser.close();
            }
            return `${fileName}.pdf`;
        }
    }

    async tearDown() {
        // await this.session?.quit();
        this.session = null;
    }
}

export default BrowserAutomation;
