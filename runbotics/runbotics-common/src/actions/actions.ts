export enum ACTION_GROUP {
	VARIABLES = 'variables',
	GENERAL = 'general',
	MAIL = 'mail',
	BROWSER = 'browser',
	LOOP = 'loop',
	API = 'api',
	JAVASCRIPT = 'javascript',
	ASANA = 'asana',
	GOOGLE = 'google',
	JIRA = 'jira',
	FILE = 'file',
	CSV = 'csv',
	DESKTOP_OFFICE_ACTIONS = 'desktopOfficeActions',
	SHAREPOINT_EXCEL = 'sharepointExcel',
	SHAREPOINT_FILE = 'sharepointFile',
	BEEOFFICE = 'beeoffice',
	SAP = 'sap',
	APPLICATION = 'application',
}

export enum VariableAction {
	ASSIGN = 'variables.assign',
	ASSIGN_LIST = 'variables.assignList',
	ASSIGN_GLOBAL = 'variables.assignGlobalVariable'
}

export enum GeneralAction {
	CONSOLE_LOG = 'general.console.log',
	DELAY = 'general.delay',
	START_PROCESS = 'general.startProcess',
}

export enum MailAction {
	SEND = 'mail.send',
}

export enum BrowserAction {
	SELENIUM_OPEN = 'browser.selenium.open',
	LAUNCH = 'browser.launch',
	CLOSE = 'browser.close',
	SELENIUM_CLICK = 'browser.selenium.click',
	SELENIUM_ELEMENTS_COUNT = 'browser.selenium.elements.count',
	SELENIUM_ELEMENT_ATTRIBUTE_CHANGE = 'browser.selenium.element.attribute.change',
	SELENIUM_TYPE = 'browser.selenium.type',
	SELENIUM_WAIT = 'browser.selenium.wait',
	SELENIUM_EDIT_CONTENT = 'browser.selenium.editContent',
	SELENIUM_SELECT = 'browser.selenium.select',
	READ_ATTRIBUTE = 'browser.read.attribute',
	READ_TEXT = 'browser.read.text',
	READ_INPUT = 'browser.read.input',
	INDEX = 'browser.index',
	SELENIUM_TAKE_SCREENSHOT = 'browser.selenium.takeScreenshot',
	SELENIUM_PRINT_TO_PDF = 'browser.selenium.printToPdf',
}

export enum LoopAction {
	LOOP = 'loop.loop',
}

export enum ApiAction {
	REQUEST = 'api.request',
	DOWNLOAD_FILE = 'api.downloadFile',
}

export declare enum JavascriptAction {
	JAVASCRIPT_RUN = "javascript.run",
	TYPESCRIPT_RUN = "typescript.run"
}

export enum AsanaAction {
	TEST = 'asana.test',
}

export enum GoogleAction {
	SHEETS_WRITE = 'google.sheets.write',
}

export enum JiraAction {
	GET_LOGGED_WORK_FOR_USER = 'jira.getLoggedWorkForUser',
}

export enum FileAction {
	APPEND_FILE = 'file.appendFile',
	CREATE_FILE = 'file.createFile',
	REMOVE_FILE = 'file.removeFile',
	READ_FILE = 'file.readFile',
	WRITE_FILE = 'file.writeFile',
}

export enum CsvAction {
	APPEND_FILE = 'csv.appendFile',
	READ_FILE = 'csv.readFile',
	WRITE_FILE = 'csv.writeFile',
	IMPORT = "csv.import"
}

export enum DesktopOfficeAction {
	POWERPOINT_OPEN = 'powerpoint.open',
	POWERPOINT_INSERT = 'desktop.powerpoint.insert',
	POWERPOINT_SAVE = 'powerpoint.save',
	POWERPOINT_CLOSE = 'powerpoint.close',
}

export enum SharepointExcelAction {
	GET_CELL = 'sharepointExcel.getCell',
	GET_RANGE = 'sharepointExcel.getRange',
	SET_CELL = 'sharepointExcel.setCell',
	UPDATE_RANGE = 'sharepointExcel.updateRange',
	OPEN_FILE_FROM_SITE = 'sharepointExcel.openFileFromSite',
	OPEN_FILE_FROM_ROOT = 'sharepointExcel.openFileFromRoot',
	CLOSE_SESSION = 'sharepointExcel.closeSession',
}

export enum SharepointFileAction {
	DOWNLOAD_FILE_FROM_ROOT = 'sharepointFile.downloadFileFromRoot',
	DOWNLOAD_FILE_FROM_SITE = 'sharepointFile.downloadFileFromSite',
	DOWNLOAD_FILES = 'sharepointFile.downloadFiles',
	UPLOAD_FILE = 'sharepointFile.uploadFile',
	CREATE_FOLDER = 'sharepointFile.createFolder',
}

export enum BeeOfficeAction {
	CREATE_NEW_TIMETABLE_ACTIVITY = 'beeOffice.createNewTimetableActivity',
	GET_EMPLOYEE = 'beeOffice.getEmployee',
	GET_EMPLOYEE_BY_ID = 'beeOffice.getEmployeeById',
	GET_ACTIVITY = 'beeOffice.getActivity',
	GET_SCHEDULE = 'beeOffice.getSchedule',
	DELETE_TIMETABLE_ACTIVITY = 'beeOffice.deleteTimeTableActivity',
	GET_ACTIVITY_GROUPS = 'beeOffice.getActivityGroups',
	GET_ACTIVITIES_BY_URL_PARAMETERS = 'beeOffice.getActivitiesByURLParameters',
}

export enum SapAction {
	CONNECT = 'sap.connect',
	DISCONNECT = 'sap.disconnect',
	START_TRANSACTION = 'sap.startTransaction',
	END_TRANSACTION = 'sap.endTransaction',
	TYPE = 'sap.type',
	SEND_VKEY = 'sap.sendVKey',
	INDEX = 'sap.index',
	READ_TEXT = 'sap.readText',
	CLICK = 'sap.click',
	FOCUS = 'sap.focus',
	DOUBLE_CLICK = 'sap.doubleClick',
	SELECT = 'sap.select',
	OPEN_CONTEXT_MENU = 'sap.openContextMenu',
	SELECT_FROM_CONTEXT_MENU = 'sap.selectFromContextMenu',
	CLICK_TOOLBAR_BUTTON = 'sap.clickToolbarButton',
	SELECT_TABLE_ROW = 'sap.selectTableRow',
}

export enum ApplicationAction {
	LAUNCH = 'application.launch',
	CLOSE = 'application.close',
}

export enum ExcelAction {
	OPEN = 'excel.open',
	GET_CELL = 'excel.getCell',
	GET_CELLS = 'excel.getCells',
	SET_CELL = 'excel.setCell',
	SET_CELLS = 'excel.setCells',
	CLEAR_CELLS = 'excel.clearCells',
	CREATE_WORKSHEET = 'excel.createWorksheet',
	RENAME_WORKSHEET = 'excel.renameWorksheet',
	SET_ACTIVE_WORKSHEET = 'excel.setActiveWorksheet',
	WORKSHEET_EXISTS = "excel.worksheetExists",
	FIND_FIRST_EMPTY_ROW = 'excel.findFirstEmptyRow',
	DELETE_COLUMNS = 'excel.deleteColumns',
	INSERT_COLUMNS_BEFORE = "excel.insertColumnsBefore",
	INSERT_COLUMNS_AFTER = "excel.insertColumnsAfter",
	INSERT_ROWS_AFTER = "excel.insertRowsAfter",
	RUN_MACRO = "excel.runMacro",
	SAVE = 'excel.save',
	CLOSE = 'excel.close',
}

export type AllActionIds =
	| VariableAction
	| GeneralAction
	| MailAction
	| BrowserAction
	| LoopAction
	| ApiAction
	| JavascriptAction
	| AsanaAction
	| GoogleAction
	| JiraAction
	| FileAction
	| CsvAction
	| DesktopOfficeAction
	| SharepointExcelAction
	| SharepointFileAction
	| BeeOfficeAction
	| SapAction
	| ApplicationAction
	| ExcelAction;


