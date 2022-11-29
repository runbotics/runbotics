import { writeFile, writeFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { DesktopRunResponse } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';
import * as firefox from 'selenium-webdriver/firefox';
import { RunIndex } from './IndexAction';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import path from 'path';
import * as BrowserTypes from './BrowserAutomation.types';
import { generatePdf, Target } from './utils';

@Injectable()
class BrowserAutomation extends StatefulActionHandler {
    private readonly logger = new RunboticsLogger(BrowserAutomation.name);

    session: WebDriver;

    constructor() {
        super();
    }

    async launchBrowser(input: BrowserTypes.BrowserLaunchActionInput): Promise<any> {
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
        if (input.target) {
            this.openSite({
                target: input.target,
            });
        }
    }

    async closeBrowser(request: BrowserTypes.BrowserActionRequest<any>): Promise<any> {
        await this.session?.quit();
        this.session = null;
    }

    async openSite(input: BrowserTypes.BrowserOpenActionInput): Promise<BrowserTypes.BrowserOpenActionOutput> {
        // process.env['PATH'] = process.env['PATH'] + ':' + process.env['CFG_CHROME_DRIVER'];
        //
        // let driver = await new Builder().forBrowser('chrome').build();
        await this.session.get(input.target);

        return {};
    }

    async run(request: BrowserTypes.BrowserActionRequest<any>): Promise<DesktopRunResponse<any>> {
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
                    output = await this.takeScreenshot(request.input);
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
                case 'browser.read.attribute':
                    output = await this.readElementAttribute(request.input);
                    break;
                case 'browser.read.text':
                    output = await this.readElementText(request.input);
                    break;
                case 'browser.read.input':
                    output = await this.readElementInput(request.input);
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

    private async elementAttributeChange(
        input: BrowserTypes.BrowserElementAttributeChangeInput,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        this.session.executeScript(
            'arguments[0].setAttribute(arguments[1], arguments[2])',
            element,
            input.attribute,
            input.newValue,
        );

        return {};
    }

    private async readElementAttribute(
        input: BrowserTypes.BrowserReadElementAttribute,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        const attributeValue = await element.getAttribute(input.attribute);
        return attributeValue;
    }

    private async readElementText(
        input: BrowserTypes.BrowserReadElementText,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        const textValue = await element.getText();
        return textValue;
    }

    private async readElementInput(
        input: BrowserTypes.BrowserReadElementInput,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        const inputValue = await element.getAttribute('value');
        return inputValue;
    }

    private async countElements(
        input: BrowserTypes.BrowserCountElementsInput,
    ): Promise<BrowserTypes.BrowserCountElementsOutput> {
        const locator: any = {};
        const [key, ...rest] = input.target.split('=');
        locator[key] = rest.join('=');

        return this.session
            .wait(until.elementsLocated(locator), 10000)
            .then((response) => ({ elementsCount: response.length }))
            .catch(() => ({ elementsCount: 0 }));
    }

    private async doClick(input: BrowserTypes.BrowserActionInput): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        await element.click();
        return {};
    }

    private async doWait(input: BrowserTypes.BrowserActionInput): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        this.logger.log('doWait', element);
        return {};
    }

    private async doType(input: BrowserTypes.BrowserActionInput): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        await element.sendKeys(input.value);

        return {};
    }

    async findElement(target: string): Promise<WebElement> {
        const locator: any = {};
        const [key, ...rest] = target.split('=');

        locator[key] = rest.join('=');
        const element = await this.session.wait(until.elementLocated(locator), 10000);
        return element;
    }

    private async doSelect(input: BrowserTypes.BrowserActionInput): Promise<BrowserTypes.BrowserClickActionOutput> {
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
            for (const option of options) {
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

    private async doIndex(input: BrowserTypes.BrowserIndexActionInput): Promise<BrowserTypes.BrowserIndexActionOutput> {
        try {
            const result = await RunIndex(this.session, input.jsonConfiguration);
            return result;
        } catch (e) {
            this.logger.error('error doindex', e);
            throw e;
        }
    }

    private async takeScreenshot(
        input: BrowserTypes.BrowserScreenshotElementInput,
    ): Promise<BrowserTypes.BrowserTakeScreenshotActionOutput> {
        const filePath = path.join(process.cwd(), 'temp', `${uuidv4()}.png`);
        try {
            const elementToScreenshot = input.target ? await this.findElement(input.target) : this.session;
            const image = await elementToScreenshot.takeScreenshot();
            writeFileSync(filePath, image, { encoding: 'base64' });
            return filePath;
        } catch (e) {
            this.logger.log('Error occured while taking screenshot', e);
            throw e;
        }
    }

    private async printToPdf(
        input: BrowserTypes.BrowserPrintToPdfActionInput,
    ): Promise<BrowserTypes.BrowserPrintToPdfActionOutput> {
        // Prince requires absolute path
        const fileName = path.join(process.cwd(), 'temp', uuidv4());
        let target: Target;

        if (input.target === 'URL' && input.url) {
            target = { url: input.url };
        }

        if (input.target === 'Session') {
            target = { content: await this.session?.executeScript('return document.body.outerHTML') };
        }
        try {
            const pdfBuffer = await generatePdf(target, {});
            writeFile(`${fileName}.pdf`, Buffer.from(pdfBuffer), 'binary', (error) => {
                if (error) throw error;
                this.logger.log(`File saved successfully at ${fileName}.pdf`);
            });
        } catch (error) {
            this.logger.error('Error occured while printing to pdf', error);
            throw error;
        }

        return `${fileName}.pdf`;
    }

    async tearDown() {
        // await this.session?.quit();
        this.session = null;
    }
}

export default BrowserAutomation;
