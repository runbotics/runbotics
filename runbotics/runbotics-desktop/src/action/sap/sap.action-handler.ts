import { Injectable } from '@nestjs/common';
import { StatefulActionHandler } from 'runbotics-sdk';

import { RunboticsLogger } from '#logger';

import { SendVKeyMapper } from './SendVKeyMapper';
import * as SapTypes from './types';

@Injectable()
export default class SapActionHandler extends StatefulActionHandler {
    private logger = new RunboticsLogger(SapActionHandler.name);
    private session = null;

    constructor() {
        super();
    }

    async connect(input: SapTypes.SAPConnectActionInput): Promise<SapTypes.SAPConnectActionOutput> {
        await import('winax');

        try {
            const app = new ActiveXObject('SapROTWr.SapROTWrapper');
            const sapGuiAuto = app.GetROTEntry('SAPGUI');
            if (!sapGuiAuto) {
                throw new Error('SAP application is not running');
            }
            const scriptingEngine = sapGuiAuto.GetScriptingEngine();
            const result = scriptingEngine.OpenConnection(input.connectionName, true);
            this.session = result.children[0];
            this.session.FindById('wnd[0]/usr/txtRSYST-BNAME').text = process.env[input.user];
            this.session.FindById('wnd[0]/usr/pwdRSYST-BCODE').text = process.env[input.password];
            this.session.FindById('wnd[0]').SendVKey(0);
        } catch (e) {
            throw new Error(e?.description ?? e.message);
        }

        return {};
    }

    /**
     *  @alias startTransaction
     *  @name SAP: Start Transaction
     *  @description Opens the transaction view. 
     *  Available transactions may vary depending on the instance that is being used.
     *  @param transaction - transaction name
     *  @example startTransaction(SE16N)
     */
    async startTransaction(
        input: SapTypes.SAPStartTransactionActionInput,
    ): Promise<SapTypes.SAPStartTransactionActionOutput> {
        this.isApplicationOpen();
        this.session.StartTransaction(input.transaction);
        return {};
    }

    /**
     *  @alias endTransaction
     *  @name SAP: End Transaction
     *  @description Exits transaction view.
     */
    async endTransaction() {
        await this.session?.EndTransaction();
    }


    /**
     *  @alias type
     *  @name SAP: Type text
     *  @description Inserts text into the input field.
     *  @param target
     *  @param value
     *  @example Target: type(wnd[0]/example/example2)
     *  @example Value: type(sample RunBotics text)
     */
    async type(input: SapTypes.SAPTypeActionInput): Promise<SapTypes.SAPTypeActionOutput> {
        this.isApplicationOpen();
        const result = (this.session.FindById(input.target).text = input.value);
        return {};
    }

    /**
     *  @alias click
     *  @name SAP: Click
     *  @description Clicks on the indicated element.
     *  @param Target
     *  @example click(wnd[1]/tbar[0]/btn[0])
     */
    async click(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).press();
        return {};
    }

    /**
     *  @alias doubleClick
     *  @name SAP: Double click
     *  @description Clicks twice on the indicated element.
     *  @param target
     *  @example doubleClick('wnd[1]/tbar[0]/btn[0]')
     */
    async doubleClick(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.isApplicationOpen();
        await this.focus(input);
        await this.sendVKey({ virtualKey: 'F2' });
        return {};
    }

    /**
     * @alias index
     * @description This action should be used to handle the SAP table. It currently needs to be reworked.
     */
    async index(input: SapTypes.SAPIndexActionInput): Promise<SapTypes.SAPIndexActionOutput> {
        this.isApplicationOpen();
        const table = this.session.FindById(input.target);
        const rowsCount = table.Rows.Count.__value;
        const columnsCount = table.Columns.Count.__value;
        const array = [];
        for (let i = 0; i < rowsCount; i++) {
            const row = [];
            for (let j = 0; j < columnsCount; j++) {
                try {
                    const value = table.GetCell(i, j).Text.__value;
                    row.push(value);
                } catch (e) {
                    row.push('!!Error!!');
                }
            }
            array.push(row);
        }
        this.logger.log('table', table);
        this.logger.log('array', array);
        return array;
    }

    /**
     *  @alias focus 
     *  @name SAP: Focus
     *  @description Selects an element and "highlights" it.
     *  @param target
     *  @example focus('wnd[0]/example/example')
     */
    async focus(input: SapTypes.SAPFocusActionInput): Promise<SapTypes.SAPFocusActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).setFocus();
        return {};
    }

    /**
     *  @alias disconnect 
     *  @name SAP: Disconnect
     *  @description Disconnects from instance on which the bot is currently logged in.
     */
    async disconnect() {
        await this.session?.Parent.CloseConnection();
        this.session = null;
    }

    /**
     *  @alias sendVKey 
     *  @name SAP: Send Virtual Key
     *  @description Indicates keyboard shortcut to be clicked by bot.
     *  @param virtualKey
     *  @example sendVKey(Enter)
     *  @see SendVKeyMapper - check out more examples
     */
    async sendVKey(input: SapTypes.SAPSendVKeyActionInput): Promise<SapTypes.SAPSendVKeyActionOutput> {
        this.isApplicationOpen();
        this.session.FindById('wnd[0]').SendVKey(SendVKeyMapper[input.virtualKey]);
        return {};
    }

    /**
     *  @alias readText
     *  @name SAP: Read text
     *  @description Reads text from indicated element.
     *  @param target
     *  @example readText(wnd[0]/example)
     *  @returns text value from chosen element
     */
    async readText(input: SapTypes.SAPReadTextActionInput): Promise<SapTypes.SAPReadTextActionOutput> {
        this.isApplicationOpen();
        const result = this.session.FindById(input.target).text;
        return result ? result.__value : null;
    }

    /**
     *  @alias select
     *  @name SAP: Select
     *  @description In some SAP transactions, 'Select' action is utilized to navigate to another tab. 
     *  Additionally, 'Select' is frequently used to choose a particular option from the menu bar.
     *  @param target
     *  @example select(wnd[0]/mbar/menu[0]/menu[1])
     */
    async select(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).select();
        return {};
    }

    /**
     *  @alias openContextMenu 
     *  @name SAP: Open Context Menu
     *  @description In some SAP transactions, e.g. SE16N, in the LFB1 table view, there are toolbar icons with an arrow mark. 
     *  Clicking on arrow, opens context menu.
     *  @param target
     *  @param menuId
     *  @example target openContextMenu(wnd[0]/titl/shellcont/shell)
     *  @example menuId openContextMenu(%GOS_TOOLBOX)
     */
    async openContextMenu(
        input: SapTypes.SAPOpenContextMenuActionInput,
    ): Promise<SapTypes.SAPOpenContextMenuActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).pressContextButton(input.menuId);
        return {};
    }

    /**
     *  @alias selectFromContextMenu 
     *  @name SAP: Select From Context Menu
     *  @description Once the context menu is opened, it selects any option, including nested ones.
     *  @param target
     *  @param optionId
     *  @example target selectFromContextMenu(wnd[0]/titl/shellcont/shell)
     *  @example optionId selectFromContextMenu(%GOS_PCATTA_CREA)
     */
    async selectFromContextMenu(
        input: SapTypes.SAPSelectFromContextMenuActionInput,
    ): Promise<SapTypes.SAPSelectFromContextMenuActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).selectContextMenuItem(input.optionId);
        return {};
    }

    /**
     *  @alias clickToolbarButton
     *  @name SAP: Click Toolbar Button
     *  @description Referring to example of table view from the openContextMenu action,
     *  there are also usual icons in toolbar that can be launched with this action.
     *  @param target
     *  @param toolId
     *  @example target clickToolbarButton(wnd[0]/usr/cntlRESULT_LIST/shellcont/shell)
     *  @example toolId clickToolbarButton(&FIND)
     */
    async clickToolbarButton(
        input: SapTypes.SAPClickToolbarButtonActionInput,
    ): Promise<SapTypes.SAPClickToolbarButtonActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).pressToolbarButton(input.toolId);
        return {};
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('Use open application action before');
        }
    }

    async run(request: SapTypes.SAPActionRequest) {
        if (process.platform !== 'win32') {
            throw new Error('SAP actions can be run only on Windows bot');
        }

        switch (request.script) {
            case 'sap.connect':
                return this.connect(request.input);
            case 'sap.startTransaction':
                return this.startTransaction(request.input);
            case 'sap.endTransaction':
                return this.endTransaction();
            case 'sap.type':
                return this.type(request.input);
            case 'sap.click':
                return this.click(request.input);
            case 'sap.doubleClick':
                return this.doubleClick(request.input);
            case 'sap.focus':
                return this.focus(request.input);
            case 'sap.disconnect':
                return this.disconnect();
            case 'sap.sendVKey':
                return this.sendVKey(request.input);
            case 'sap.readText':
                return this.readText(request.input);
            case 'sap.index':
                return this.index(request.input);
            case 'sap.select':
                return this.select(request.input);
            case 'sap.openContextMenu':
                return this.openContextMenu(request.input);
            case 'sap.selectFromContextMenu':
                return this.selectFromContextMenu(request.input);
            case 'sap.clickToolbarButton':
                return this.clickToolbarButton(request.input);
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown(): Promise<void> {
        await this.endTransaction();
        await this.disconnect();
    }
}
