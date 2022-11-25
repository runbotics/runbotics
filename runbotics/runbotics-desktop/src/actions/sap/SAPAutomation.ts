import { Injectable } from '@nestjs/common';
import { DesktopRunRequest } from 'runbotics-sdk';
import { StatefulActionHandler } from 'runbotics-sdk';
import { DesktopRunResponse } from 'runbotics-sdk';
import 'winax';
import { SendVKeyMapper } from './SendVKeyMapper';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import * as SapTypes from './SAPAutomation.types';

@Injectable()
class SAPAutomation extends StatefulActionHandler {
    private sessions: Record<string, any> = {};
    private logger = new RunboticsLogger(SAPAutomation.name);
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
            this.sessions['session'].FindById('wnd[0]/usr/txtRSYST-MANDT').text = '100';
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

    async endTransaction(
        input: SapTypes.SAPStartTransactionActionInput,
    ): Promise<SapTypes.SAPStartTransactionActionOutput> {
        const result = this.sessions['session'].EndTransaction();
        return {};
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

    async run(request: DesktopRunRequest<any>): Promise<DesktopRunResponse<any>> {
        const action: SapTypes.SAPActionRequest<any> = request as SapTypes.SAPActionRequest<any>;
        let output: any = {};
        switch (action.script) {
            case 'sap.connect':
                output = await this.connect(action.input);
                break;
            case 'sap.startTransaction':
                output = await this.startTransaction(action.input);
                break;
            case 'sap.endTransaction':
                output = await this.endTransaction(action.input);
                break;
            case 'sap.type':
                output = await this.type(action.input);
                break;
            case 'sap.click':
                output = await this.click(action.input);
                break;
            case 'sap.doubleClick':
                output = await this.doubleClick(action.input);
                break;
            case 'sap.focus':
                output = await this.focus(action.input);
                break;
            case 'sap.disconnect':
                output = await this.disconnect(action.input);
                break;
            case 'sap.sendVKey':
                output = await this.sendVKey(action.input);
                break;
            case 'sap.readText':
                output = await this.readText(action.input);
                break;
            case 'sap.index':
                output = await this.index(action.input);
                break;
            case 'sap.select':
                output = await this.select(action.input);
                break;
            case 'sap.openContextMenu':
                output = await this.openContextMenu(action.input);
                break;
            case 'sap.selectFromContextMenu':
                output = await this.selectFromContextMenu(action.input);
                break;
            case 'sap.clickToolbarButton':
                output = await this.clickToolbarButton(action.input);
                break;
            default:
                throw new Error('Action not found');
        }

        return {
            status: 'ok',
            output: output,
        };
    }

    async tearDown(): Promise<void> {
        // if(this.sessions['session'] && this.sessions['session'].Parent) {
        //     this.sessions['session'].Parent.CloseConnection();
        // }

        delete this.sessions['session'];
    }
}

export default SAPAutomation;
