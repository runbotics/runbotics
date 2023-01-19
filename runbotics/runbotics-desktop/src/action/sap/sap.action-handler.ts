import { Injectable } from '@nestjs/common';
import { StatefulActionHandler } from 'runbotics-sdk';
import 'winax';

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

    async startTransaction(
        input: SapTypes.SAPStartTransactionActionInput,
    ): Promise<SapTypes.SAPStartTransactionActionOutput> {
        this.session.StartTransaction(input.transaction);
        return {};
    }

    async endTransaction() {
        await this.session?.EndTransaction();
    }

    async type(input: SapTypes.SAPTypeActionInput): Promise<SapTypes.SAPTypeActionOutput> {
        const result = (this.session.FindById(input.target).text = input.value);
        return {};
    }

    async click(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.session.FindById(input.target).press();
        return {};
    }

    async doubleClick(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        await this.focus(input);
        await this.sendVKey({ virtualKey: 'F2' });
        return {};
    }

    async index(input: SapTypes.SAPIndexActionInput): Promise<SapTypes.SAPIndexActionOutput> {
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

    async focus(input: SapTypes.SAPFocusActionInput): Promise<SapTypes.SAPFocusActionOutput> {
        this.session.FindById(input.target).setFocus();
        return {};
    }

    async disconnect() {
        await this.session?.Parent.CloseConnection();
        this.session = null;
    }

    async sendVKey(input: SapTypes.SAPSendVKeyActionInput): Promise<SapTypes.SAPSendVKeyActionOutput> {
        this.session.FindById('wnd[0]').SendVKey(SendVKeyMapper[input.virtualKey]);
        return {};
    }

    async readText(input: SapTypes.SAPReadTextActionInput): Promise<SapTypes.SAPReadTextActionOutput> {
        const result = this.session.FindById(input.target).text;
        return result ? result.__value : null;
    }

    async select(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.session.FindById(input.target).select();
        return {};
    }

    async openContextMenu(
        input: SapTypes.SAPOpenContextMenuActionInput,
    ): Promise<SapTypes.SAPOpenContextMenuActionOutput> {
        this.session.FindById(input.target).pressContextButton(input.menuId);
        return {};
    }

    async selectFromContextMenu(
        input: SapTypes.SAPSelectFromContextMenuActionInput,
    ): Promise<SapTypes.SAPSelectFromContextMenuActionOutput> {
        this.session.FindById(input.target).selectContextMenuItem(input.optionId);
        return {};
    }

    async clickToolbarButton(
        input: SapTypes.SAPClickToolbarButtonActionInput,
    ): Promise<SapTypes.SAPClickToolbarButtonActionOutput> {
        this.session.FindById(input.target).pressToolbarButton(input.toolId);
        return {};
    }

    async run(request: SapTypes.SAPActionRequest) {
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
