export enum MicrosoftPlatform {
    SharePoint = 'SharePoint',
    OneDrive = 'OneDrive',
}

export enum CloudPath {
    ROOT = 'root',
    SITE = 'site',
}

export enum ActionRegex {
    VARIABLE_NAME = '^[a-zA-Z0-9_]*$',
    EXCEL_WORKSHEET_NAME = '^[^\\[\\]\\*\\?\\/\\\\\\:]{1,31}$',
    EXCEL_CELL_ADDRESS = '^[a-zA-Z]+\\d+$',
    EXCEL_COLUMN_NAME = '^[a-zA-Z]+',
    EXCEL_ROW_NUMBER = '^\\d+$',
    EXCEL_SPLIT_ADDRESS = '[!:]',
    EXCEL_ROW_RANGE = '^(\\d+:\\d+)$',
    EXCEL_DELETE_ROW_INPUT = '^[\\d]+$',
    EXCEL_DELETE_ROWS_INPUT = '^(\\d+:\\d+)$|^(\\[(\\d+\\,*\\s*)+])$|^(\\[(\\d+\\,*\\s*)+])$|^(\\d+)$',
    EXCEL_CELL_RANGE = '^[A-Za-z]+[0-9]+:[A-Za-z]+[0-9]+$'
}

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
    CLOUD_EXCEL = 'cloudExcel',
    CLOUD_FILE = 'cloudFile',
    BEEOFFICE = 'beeoffice',
    SAP = 'sap',
    APPLICATION = 'application',
    FOLDER = 'folder'
}

export enum VariableAction {
    ASSIGN = 'variables.assign',
    ASSIGN_LIST = 'variables.assignList',
    ASSIGN_GLOBAL = 'variables.assignGlobalVariable',
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
}

export enum LoopAction {
    LOOP = 'loop.loop',
}

export enum ApiAction {
    REQUEST = 'api.request',
    DOWNLOAD_FILE = 'api.downloadFile',
}

export declare enum JavascriptAction {
    JAVASCRIPT_RUN = 'javascript.run',
    TYPESCRIPT_RUN = 'typescript.run',
}

export enum AsanaAction {
    TEST = 'asana.test',
}

export enum GoogleAction {
    SHEETS_WRITE = 'google.sheets.write',
}

export enum JiraCloudAction {
    GET_USER_WORKLOGS = 'jiraCloud.getUserWorklogs',
}

export enum JiraServerAction {
    GET_USER_WORKLOGS = 'jiraServer.getUserWorklogs',
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
    IMPORT = 'csv.import',
}

export enum DesktopOfficeAction {
    POWERPOINT_OPEN = 'powerpoint.open',
    POWERPOINT_INSERT = 'desktop.powerpoint.insert',
    POWERPOINT_SAVE = 'powerpoint.save',
    POWERPOINT_CLOSE = 'powerpoint.close',
}

export enum CloudExcelAction {
    GET_CELL = 'cloudExcel.getCell',
    GET_CELLS = 'cloudExcel.getCells',
    SET_CELL = 'cloudExcel.setCell',
    SET_CELLS = 'cloudExcel.setCells',
    OPEN_FILE = 'cloudExcel.openFile',
    CLOSE_SESSION = 'cloudExcel.closeSession',
    CREATE_WORKSHEET = 'cloudExcel.createWorksheet',
    DELETE_WORKSHEET = 'cloudExcel.deleteWorksheet',
    DELETE_COLUMNS = 'cloudExcel.deleteColumns',
    GET_WORKSHEET_CONTENT = 'cloudExcel.getWorksheetContent',
    DELETE_ROWS = 'cloudExcel.deleteRows',
}

export enum CloudFileAction {
    DOWNLOAD_FILE = 'cloudFile.download',
    UPLOAD_FILE = 'cloudFile.upload',
    CREATE_FOLDER = 'cloudFile.createFolder',
    MOVE_FILE = 'cloudFile.moveFile',
    DELETE_ITEM = 'cloudFile.deleteItem',
    CREATE_SHARE_LINK = 'cloudFile.createShareLink'
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
    DELETE_WORKSHEET = 'excel.deleteWorksheet',
    SET_ACTIVE_WORKSHEET = 'excel.setActiveWorksheet',
    WORKSHEET_EXISTS = 'excel.worksheetExists',
    FIND_FIRST_EMPTY_ROW = 'excel.findFirstEmptyRow',
    DELETE_COLUMNS = 'excel.deleteColumns',
    INSERT_COLUMNS_BEFORE = 'excel.insertColumnsBefore',
    INSERT_COLUMNS_AFTER = 'excel.insertColumnsAfter',
    INSERT_ROWS_BEFORE = 'excel.insertRowsBefore',
    INSERT_ROWS_AFTER = 'excel.insertRowsAfter',
    RUN_MACRO = 'excel.runMacro',
    READ_TABLE = 'excel.readTable',
    DELETE_ROWS = 'excel.deleteRows',
    SAVE = 'excel.save',
    CLOSE = 'excel.close',
    EXPORT_TO_CSV = 'excel.exportToCsv',
    EXPORT_HTML_TABLE = 'excel.exportHtmlTable'
}

export enum DesktopAction {
    CLICK = 'desktop.click',
    TYPE = 'desktop.type',
    COPY = 'desktop.copy',
    PASTE = 'desktop.paste',
    CURSOR_SELECT = 'desktop.cursorSelect',
    READ_CLIPBOARD_CONTENT = 'desktop.readClipboardContent',
    MAXIMIZE_ACTIVE_WINDOW = 'desktop.maximizeActiveWindow',
    TAKE_SCREENSHOT = 'desktop.takeScreenshot',
    READ_TEXT_FROM_IMAGE = 'desktop.readTextFromImage',
    PERFORM_KEYBOARD_SHORTCUT = 'desktop.performKeyboardShortcut',
}

export enum VisualBasicAction {
    RUN_SCRIPT = 'visualBasic.runScript',
}

export enum ImageAction {
    GRAY_SCALE = 'image.grayscale',
}

export enum FolderAction {
    DELETE = 'folder.delete',
    DISPLAY_FILES = 'folder.displayFiles'
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
    | JiraCloudAction
    | JiraServerAction
    | FileAction
    | CsvAction
    | DesktopOfficeAction
    | CloudExcelAction
    | CloudFileAction
    | BeeOfficeAction
    | SapAction
    | ApplicationAction
    | ExcelAction
    | DesktopAction
    | VisualBasicAction
    | ImageAction
    | FolderAction;
