import { Injectable } from '@nestjs/common';
import { DesktopRunRequest, StatefulActionHandler, DesktopRunResponse } from 'runbotics-sdk';
import 'winax';

import { RunboticsLogger } from '#logger';

import { SendVKeyMapper } from './SendVKeyMapper';
import * as SapTypes from './types';

@Injectable()
export default class SapActionHandler extends StatefulActionHandler {
    private sessions: Record<string, any> = {};
    private logger = new RunboticsLogger(SapActionHandler.name);
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
            this.sessions['session'] = result.children[0];
            this.sessions['session'].FindById('wnd[0]/usr/txtRSYST-BNAME').text = process.env[input.user];
            this.sessions['session'].FindById('wnd[0]/usr/pwdRSYST-BCODE').text = process.env[input.password];
            this.sessions['session'].FindById('wnd[0]').SendVKey(0);
        } catch (e) {
            throw new Error(e?.description ?? e.message);
        }

        return {};
    }

    async startTransaction(
        input: SapTypes.SAPStartTransactionActionInput,
    ): Promise<SapTypes.SAPStartTransactionActionOutput> {
        this.sessions['session'].StartTransaction(input.transaction);
        return {};
    }

    async endTransaction() {
        this.sessions['session'].EndTransaction();
    }

    async type(input: SapTypes.SAPTypeActionInput): Promise<SapTypes.SAPTypeActionOutput> {
        const result = (this.sessions['session'].FindById(input.target).text = input.value);
        return {};
    }

    async click(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.sessions['session'].FindById(input.target).press();
        return {};
    }

    async doubleClick(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        await this.focus(input);
        await this.sendVKey({ virtualKey: 'F2' });
        return {};
    }

    async index(input: SapTypes.SAPIndexActionInput): Promise<SapTypes.SAPIndexActionOutput> {
        const table = this.sessions['session'].FindById(input.target);
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
        this.sessions['session'].FindById(input.target).setFocus();
        return {};
    }

    async disconnect(input: any): Promise<any> {
        this.sessions['session'].Parent.CloseConnection();
        return {};
    }

    async sendVKey(input: SapTypes.SAPSendVKeyActionInput): Promise<SapTypes.SAPSendVKeyActionOutput> {
        this.sessions['session'].FindById('wnd[0]').SendVKey(SendVKeyMapper[input.virtualKey]);
        return {};
    }

    async readText(input: SapTypes.SAPReadTextActionInput): Promise<SapTypes.SAPReadTextActionOutput> {
        const result = this.sessions['session'].FindById(input.target).text;
        return result ? result.__value : null;
    }

    async select(input: SapTypes.SAPClickActionInput): Promise<SapTypes.SAPClickActionOutput> {
        this.sessions['session'].FindById(input.target).select();
        return {};
    }

    async openContextMenu(
        input: SapTypes.SAPOpenContextMenuActionInput,
    ): Promise<SapTypes.SAPOpenContextMenuActionOutput> {
        this.sessions['session'].FindById(input.target).pressContextButton(input.menuId);
        return {};
    }

    async selectFromContextMenu(
        input: SapTypes.SAPSelectFromContextMenuActionInput,
    ): Promise<SapTypes.SAPSelectFromContextMenuActionOutput> {
        this.sessions['session'].FindById(input.target).selectContextMenuItem(input.optionId);
        return {};
    }

    async clickToolbarButton(
        input: SapTypes.SAPClickToolbarButtonActionInput,
    ): Promise<SapTypes.SAPClickToolbarButtonActionOutput> {
        this.sessions['session'].FindById(input.target).pressToolbarButton(input.toolId);
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
                return this.disconnect(request.input);
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
        // if(this.sessions['session'] && this.sessions['session'].Parent) {
        //     this.sessions['session'].Parent.CloseConnection();
        // }

        delete this.sessions['session'];
    }
}
