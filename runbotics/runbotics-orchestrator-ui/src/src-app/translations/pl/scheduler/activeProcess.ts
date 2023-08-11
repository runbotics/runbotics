import englishActiveProcessTranslations from '#src-app/translations/en/scheduler/activeProcess';

const schedulerActiveProcessTranslations : typeof englishActiveProcessTranslations = {
    'Scheduler.ActiveProcess.Table.Header.Id': 'ID',
    'Scheduler.ActiveProcess.Table.Header.Bot': 'Bot',
    'Scheduler.ActiveProcess.Table.Header.Step': 'Krok',
    'Scheduler.ActiveProcess.Table.Header.StartTime': 'Czas rozpoczęcia',
    'Scheduler.ActiveProcess.Table.Header.Initiator': 'Inicjator',
    'Scheduler.ActiveProcess.Table.Rows.Bot.Deleted': 'Usunięty',
    'Scheduler.ActiveProcess.Table.Rows.Initiator.Login': 'Dodano harmonogram ({{ login }})',
    'Scheduler.ActiveProcess.Terminate.Success': 'Działanie instancji {{ processName }} procesu została zakończona',
    'Scheduler.ActiveProcess.Terminate.Failed': 'Nie udało się zakończyć instancji {{ processName }} procesu',
    'Scheduler.ActiveProcess.Terminate.Dialog.Title': 'Zakończ działanie instancji {{ processName }} procesu',
    'Scheduler.ActiveProcess.Terminate.Dialog.Confirmation.Message': 'Czy na pewno chcesz zakończyć działanie instancji {{ processName }} procesu?',
};

export default schedulerActiveProcessTranslations;
