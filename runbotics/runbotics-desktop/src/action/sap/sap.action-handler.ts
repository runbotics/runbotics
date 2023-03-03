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
     *  @name SAP: Start Transaction
     *  @description Opens the transaction view. 
     *  Available transactions may vary depending on the instance that is being used.
     *  @param transaction - transaction name
     *  @example transaction: 'SE16N'
     */
    async startTransaction(
        input: SapTypes.SAPStartTransactionActionInput,
    ): Promise<SapTypes.SAPStartTransactionActionOutput> {
        this.isApplicationOpen();
        this.session.StartTransaction(input.transaction);
        return {};
    }

    /**
     *  @name SAP: End Transaction
     *  @description Closes current transaction associated with session.
     */
    async endTransaction() {
        await this.session?.EndTransaction();
    }


    /**
     *  @name SAP: Type text
     *  @description Inserts text into the input field.
     *  @param target - ID of SAP user interface element
     *  @param value - text to be inserted
     *  @example target: 'wnd[0]/example/target/path'
     *  @example value: 'example text'
     */
    async type(input: SapTypes.SAPTypeActionInput): Promise<SapTypes.SAPTypeActionOutput> {
        this.isApplicationOpen();
        const result = (this.session.FindById(input.target).text = input.value);
        return {};
    }

    /**
     *  @name SAP: Click
     *  @description Clicks on the indicated element.
     *  @param target - ID of SAP user interface element
     *  @example target: 'wnd[0]/tbar[0]/btn[0]'
     */
    async click(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).press();
        return {};
    }

    /**
     *  @name SAP: Double click
     *  @description Clicks twice on the indicated element.
     *  @param target - ID of SAP user interface element
     *  @example target: 'wnd[0]/tbar[0]/btn[0]'
     */
    async doubleClick(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.isApplicationOpen();
        await this.focus(input);
        await this.sendVKey({ virtualKey: 'F2' });
        return {};
    }

    /**
     * @description Reads SAP table.
     * @deprecated It currently needs to be reworked.
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
     *  @name SAP: Focus
     *  @description Selects an element and "highlights" it.
     *  @param target - ID of SAP user interface element
     *  @example target: 'wnd[0]/example/target/path'
     */
    async focus(input: SapTypes.SAPFocusActionInput): Promise<SapTypes.SAPFocusActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).setFocus();
        return {};
    }

    /**
     *  @name SAP: Disconnect
     *  @description Closes current session and disconnects from the instance.
     */
    async disconnect() {
        await this.session?.Parent.CloseConnection();
        this.session = null;
    }

    /**
     *  @name SAP: Send Virtual Key
     *  @description Emulates keyboard shortcut.
     *  @param virtualKey - any keyboard shortcut that is supported 
     *  @see SendVKeyMapper - keymap file containing supported shortcuts
     *  @example virtualKey: Enter
     */
    async sendVKey(input: SapTypes.SAPSendVKeyActionInput): Promise<SapTypes.SAPSendVKeyActionOutput> {
        this.isApplicationOpen();
        this.session.FindById('wnd[0]').SendVKey(SendVKeyMapper[input.virtualKey]);
        return {};
    }

    /**
     *  @name SAP: Read text
     *  @description Reads text from indicated element.
     *  @param target - ID of SAP user interface element
     *  @example target: 'wnd[0]/example/target/path'
     *  @returns text value from chosen element
     */
    async readText(input: SapTypes.SAPReadTextActionInput): Promise<SapTypes.SAPReadTextActionOutput> {
        this.isApplicationOpen();
        const result = this.session.FindById(input.target).text;
        return result ? result.__value : null;
    }

    /**
     *  @name SAP: Select
     *  @description Selects a particular option from the menu bar or navigates to another tab.
     *  @param target - ID of SAP user interface element
     *  @example target: 'wnd[0]/mbar/menu[0]/menu[1]'
     */
    async select(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).select();
        return {};
    }

    /**
     *  @name SAP: Open Context Menu
     *  @description Depending on the server implementation, the context menu may be located in the window header or near elements such as a table.
     *  @param target - ID of SAP user interface element
     *  @param menuId - ID of the icon located in SAP user interface
     *  @example target: 'wnd[0]/titl/shellcont/shell'
     *  @example menuId: '%GOS_TOOLBOX'
     */
    async openContextMenu(
        input: SapTypes.SAPOpenContextMenuActionInput,
    ): Promise<SapTypes.SAPOpenContextMenuActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).pressContextButton(input.menuId);
        return {};
    }

    /**
     *  @name SAP: Select From Context Menu
     *  @description Once the context menu is opened, it selects any option, including nested ones.
     *  @param target - ID of SAP user interface element
     *  @param optionId - ID of a specific option from context menu
     *  @example target: 'wnd[0]/titl/shellcont/shell'
     *  @example optionId: '%GOS_PCATTA_CREA'
     */
    async selectFromContextMenu(
        input: SapTypes.SAPSelectFromContextMenuActionInput,
    ): Promise<SapTypes.SAPSelectFromContextMenuActionOutput> {
        this.isApplicationOpen();
        this.session.FindById(input.target).selectContextMenuItem(input.optionId);
        return {};
    }

    /**
     *  @name SAP: Click Toolbar Button
     *  @description Referring to example of table view from the openContextMenu action,
     *  there are also usual toolbar elements that can be launched with this action.
     *  @param target - ID of SAP user interface element
     *  @param toolId - ID of the button located in SAP user interface
     *  @example target: 'wnd[0]/usr/cntlRESULT_LIST/shellcont/shell'
     *  @example toolId: '&FIND'
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
