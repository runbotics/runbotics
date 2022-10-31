type IActions = {
    [key: string]: { [key: string]: string | object };
};

const actionKeys: IActions = ({
    event: {
        start: 'Process.List.Table.Step.StartEvent',
        end: 'Process.List.Table.Step.EndEvent',
    },
    api: {
        request: 'Process.Details.Modeler.Actions.Api.Label',
        downloadFile: 'Process.Details.Modeler.Actions.Api.DownloadFile.Label',
    },
    application: {
        launch: 'Process.Details.Modeler.Actions.Application.Launch.Label',
        close: 'Process.Details.Modeler.Actions.Application.Close.Label',
    },
    asana: {
        test: 'Process.Details.Modeler.Actions.Asana.Label',
    },
    beeOffice: {
        createNewTimetableActivity: 'Process.Details.Modeler.Actions.BeeOffice.Create.Label',
        getEmployee: 'Process.Details.Modeler.Actions.BeeOffice.GetEmployee.Label',
        getEmployeeById: 'Process.Details.Modeler.Actions.BeeOffice.GetEmployeeById.Label',
        getActivity: 'Process.Details.Modeler.Actions.BeeOffice.GetActivity.Label',
        getSchedule: 'Process.Details.Modeler.Actions.BeeOffice.GetTimeTable.Label',
        deleteTimeTableActivity: 'Process.Details.Modeler.Actions.BeeOffice.DeleteTimeTable.Label', 
        getActivityGroups: 'Process.Details.Modeler.Actions.BeeOffice.GetActivityGroups.Label',
        getActivitiesByURLParameters: 'Process.Details.Modeler.Actions.BeeOffice.GetActivitiesByUrl.Label',
    },
    browser: {
        read: {
            attribute: 'Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Label',
            text: 'Process.Details.Modeler.Actions.Browser.Read.Text.Label',
        },
        selenium: {
            open: 'Process.Details.Modeler.Actions.Browser.Open.Label',
            click: 'Process.Details.Modeler.Actions.Browser.Click.Label',
            type: 'Process.Details.Modeler.Actions.Browser.Type.Label',
            wait: 'Process.Details.Modeler.Actions.Browser.Wait.Label',
            editContent: 'Process.Details.Modeler.Actions.Browser.EditContent.Label',
            select: 'Process.Details.Modeler.Actions.Browser.Select.Label',
            index: 'Process.Details.Modeler.Actions.Browser.Index.Label',
            takeScreenshot: 'Process.Details.Modeler.Actions.Browser.TakeScreenshot.Label',
            printToPdf: 'Process.Details.Modeler.Actions.Browser.PrintToPdf.Label',
            elements: {
                count: 'Process.Details.Modeler.Actions.Browser.CountElements.Label',
            },
            element: {
                attribute: {
                    change: 'Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Label',
                },
            },
        },
        launch: 'Process.Details.Modeler.Actions.Browser.Launch.Label',
        close: 'Process.Details.Modeler.Actions.Browser.Close.Label',
    },
    import: {
        csv: 'Process.Details.Modeler.Actions.CSV.Import.Label',
    },
    csv: {
        appendFile: 'Process.Details.Modeler.Actions.CSV.AppendFile.Label',
        readFile: 'Process.Details.Modeler.Actions.CSV.ReadFile.Label',
        writeFile: 'Process.Details.Modeler.Actions.CSV.WriteFile.Label',
    },
    desktop: {
        powerpoint: {
            open: 'Process.Details.Modeler.Actions.DesktopPowerPoint.Open.Label',
            insert: 'Process.Details.Modeler.Actions.DesktopPowerPoint.CopySlide.Label',
            save: 'Process.Details.Modeler.Actions.DesktopPowerPoint.Save.Label',
            close: 'Process.Details.Modeler.Actions.DesktopPowerPoint.Close.Label',
        },
    },
    file: {
        appendFile: 'Process.Details.Modeler.Actions.File.AppendFile.Label',
        createFile: 'Process.Details.Modeler.Actions.File.CreateFile.Label',
        removeFile: 'Process.Details.Modeler.Actions.File.RemoveFile.Label',
        readFile: 'Process.Details.Modeler.Actions.File.ReadFile.Label',
        writeFile: 'Process.Details.Modeler.Actions.File.WriteFile.Label',
    },
    general: {
        delay: "Process.Details.Modeler.Actions.General.Delay.Label",
        startProcess: "Process.Details.Modeler.Actions.General.StartProcess.Label",
        console: {
            log: 'Process.Details.Modeler.Actions.General.ConsoleLog.Label',
        },
    },
    google: {
        sheets: {
            write: 'Process.Details.Modeler.Actions.GoogleSheets.Write.Label',
        },
    },
    loop: {
        init: 'Process.Details.Modeler.Actions.Loop.Loop1.Label',
        loop: 'Process.Details.Modeler.Actions.Loop.Loop2.Label',
    },
    typescript: {
        run: 'Process.Details.Modeler.Actions.Javascript.RunTypescript.Label',
    },
    javascript: {
        run: 'Process.Details.Modeler.Actions.Javascript.RunJavascript.Label',
    },
    jira: {
        getLoggedWork: 'Process.Details.Modeler.Actions.Jira.GetLoggedWork.Label',
    },
    mail: {
        send: 'Process.Details.Modeler.Actions.Mail.Send.Label',
    },
    sap: {
        connect: 'Process.Details.Modeler.Actions.SAP.Connect.Label',
        disconnect: 'Process.Details.Modeler.Actions.SAP.Disconnect.Label',
        startTransaction: 'Process.Details.Modeler.Actions.SAP.StartTransaction.Label',
        endTransaction: 'Process.Details.Modeler.Actions.SAP.EndTransaction.Label',
        type: 'Process.Details.Modeler.Actions.SAP.Type.Label',
        sendVKey: 'Process.Details.Modeler.Actions.SAP.SendVKey.Label',
        index: 'Process.Details.Modeler.Actions.SAP.Index.Label',
        readText: 'Process.Details.Modeler.Actions.SAP.ReadText.Label',
        click: 'Process.Details.Modeler.Actions.SAP.Click.Label',
        focus: 'Process.Details.Modeler.Actions.SAP.Focus.Label',
        doubleClick: 'Process.Details.Modeler.Actions.SAP.DoubleClick.Label',
        select: 'Process.Details.Modeler.Actions.SAP.Select.Label',
    },
    sharepointExcel: {
        getCell: 'Process.Details.Modeler.Actions.SharePointExcel.GetCell.Label',
        getRange: 'Process.Details.Modeler.Actions.SharePointExcel.GetRange.Label',
        setCell: 'Process.Details.Modeler.Actions.SharePointExcel.SetCell.Label',
        updateRange: 'Process.Details.Modeler.Actions.SharePointExcel.UpdateRange.Label',
        openFileFromSite: 'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromSite.Label',
        openFileFromRoot: 'Process.Details.Modeler.Actions.SharePointExcel.OpenFileFromRoot.Label',
        closeSession: 'Process.Details.Modeler.Actions.SharePointExcel.CloseSession.Label',
    },
    sharePointFile: {
        downloadFileFromRoot: 'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromRoot.Label',
        downloadFileFromSite: 'Process.Details.Modeler.Actions.SharePointFile.DownloadFileFromSite.Label',
        downloadFiles: 'Process.Details.Modeler.Actions.SharePointFile.DownloadFiles.Label',
        uploadFile: 'Process.Details.Modeler.Actions.SharePointFile.Upload.Label',
        createFolder: 'Process.Details.Modeler.Actions.SharePointFile.CreateFolder.Label',

    },
    variables: {
        assign: 'Process.Details.Modeler.Actions.Variable.Assign.Label',
        assignList: 'Process.Details.Modeler.Actions.Variable.AssignList.Label',
        assignGlobalVariable: 'Process.Details.Modeler.Actions.Variable.AssignGlobal.Label',
    }
    
});

export default actionKeys;
