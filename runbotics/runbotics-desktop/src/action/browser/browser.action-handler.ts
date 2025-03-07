import { writeFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { StatefulActionHandler } from '@runbotics/runbotics-sdk';
import { Builder, By, until, WebDriver, WebElement } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';
import * as firefox from 'selenium-webdriver/firefox';
import * as chrome from 'selenium-webdriver/chrome';
import path from 'path';

import { RunboticsLogger } from '#logger';

import { RunIndex } from './IndexAction';
import * as BrowserTypes from './types';
import { ServerConfigService } from '#config';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import { BrowserLoginCredential } from './types';

@Injectable()
export default class BrowserActionHandler extends StatefulActionHandler {
    private readonly logger = new RunboticsLogger(BrowserActionHandler.name);

    private session: WebDriver = null;

    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    private async getFirefoxSession(isHeadless: boolean | undefined, isWin?: boolean) {
        const driversPath = process.cwd();
        const geckoDriver = driversPath + '/' + this.serverConfigService.cfgGeckoDriver;
        this.logger.log('geckoDriver', geckoDriver);

        process.env['PATH'] = process.env['PATH'] + (isWin ? ';' : ':') + geckoDriver;
        this.logger.log('Path', process.env['PATH']);
        let optionsFF = new firefox.Options()
            .setPreference('xpinstall.signatures.required', false)
            .setPreference('devtools.console.stdout.content', true)
            .setBinary(this.serverConfigService.cfgFirefoxBin);

        if (isHeadless) {
            optionsFF = optionsFF.headless();
        }

        return new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(optionsFF)
            .setFirefoxService(
                new firefox.ServiceBuilder()
                    //.enableVerboseLogging()
                    .setStdio('inherit'),
            )
            .build();
    }

    private async getChromeSession(isHeadless: boolean | undefined) {
        const chromeOptions = new chrome.Options();
        chromeOptions.addArguments(
            '--ignore-ssl-errors=yes',
            '--ignore-certificate-errors',
            '--disable-notifications',
            '--disable-infobars',
        );

        if (isHeadless) {
            chromeOptions.headless();
        }

        return new Builder()
            .forBrowser('chrome')
            .usingServer(this.serverConfigService.chromeAddress)
            .setChromeOptions(chromeOptions)
            .build();
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

        const isWin = process.platform === 'win32';
        this.logger.log('isWin', isWin);

        this.session = await (this.serverConfigService.chromeAddress
            ? this.getChromeSession(input.headless)
            : this.getFirefoxSession(input.headless, isWin));

        if (input.target) {
            await this.openSite({
                target: input.target,
            });
        }
    }

    async closeBrowser() {
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

    private async elementAttributeChange(
        input: BrowserTypes.BrowserElementAttributeChangeInput,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        await this.session.executeScript(
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
        return element.getAttribute(input.attribute);
    }

    private async readElementText(
        input: BrowserTypes.BrowserReadElementText,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        return element.getText();
    }

    private async readElementInput(
        input: BrowserTypes.BrowserReadElementInput,
    ): Promise<BrowserTypes.BrowserClickActionOutput> {
        const element = await this.findElement(input.target);
        return element.getAttribute('value');
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
        if (input.clear) {
            await element.clear();
        }
        await element.sendKeys(input.value);

        return {};
    }
    private async insertCredentials(input: BrowserTypes.BrowserInsertCredentials, credential: BrowserLoginCredential): Promise<BrowserTypes.BrowserClickActionOutput> {
        const login = await this.findElement(input.loginTarget);
        const password = await this.findElement(input.passwordTarget);
        const element = await this.findElement(input.submitButtonTarget);

        login.clear();
        password.clear();

        await login.sendKeys(credential.login);
        await password.sendKeys(credential.password);

        element.click();

        return {};
    }

    async findElement(target: string): Promise<WebElement> {
        const locator: any = {};
        const [key, ...rest] = target.split('=');

        locator[key] = rest.join('=');
        return this.session.wait(until.elementLocated(locator), 10000);
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
            this.logger.log('Error occurred while taking screenshot', e);
            throw e;
        }
    }

    private isBrowserOpen() {
        if (!this.session) {
            throw new Error('The browser is not running');
        }
    }

    run(request: BrowserTypes.BrowserActionRequest) {
        switch (request.script) {
            case 'browser.launch':
                return this.launchBrowser(request.input);
            case 'browser.close':
                return this.closeBrowser();
            case 'browser.selenium.open':
                this.isBrowserOpen();
                return this.openSite(request.input);
            case 'browser.selenium.type':
                this.isBrowserOpen();
                return this.doType(request.input);
            case 'browser.selenium.insertCredentials': {
                this.isBrowserOpen();

                const loginCredential = credentialAttributesMapper<BrowserLoginCredential>(request.credentials);

                return this.insertCredentials(request.input, loginCredential);
            }
            case 'browser.selenium.click':
                this.isBrowserOpen();
                return this.doClick(request.input);
            case 'browser.selenium.wait':
                this.isBrowserOpen();
                return this.doWait(request.input);
            case 'browser.selenium.select':
                this.isBrowserOpen();
                return this.doSelect(request.input);
            case 'browser.selenium.takeScreenshot':
                this.isBrowserOpen();
                return this.takeScreenshot(request.input);
            case 'browser.index':
                this.isBrowserOpen();
                return this.doIndex(request.input);
            case 'browser.selenium.elements.count':
                this.isBrowserOpen();
                return this.countElements(request.input);
            case 'browser.selenium.element.attribute.change':
                this.isBrowserOpen();
                return this.elementAttributeChange(request.input);
            case 'browser.read.attribute':
                this.isBrowserOpen();
                return this.readElementAttribute(request.input);
            case 'browser.read.text':
                this.isBrowserOpen();
                return this.readElementText(request.input);
            case 'browser.read.input':
                this.isBrowserOpen();
                return this.readElementInput(request.input);
            default: {
                if (!this.pluginService) {
                    throw new Error('Action not found');
                }
                this.isBrowserOpen();
                return this.pluginService.run(request, this);
            }
        }
    }

    async tearDown() {
        await this.closeBrowser();
    }
}
