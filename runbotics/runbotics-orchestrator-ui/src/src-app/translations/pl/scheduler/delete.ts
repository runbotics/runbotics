import englishSchedulerDeleteTranslations from '#src-app/translations/en/scheduler/delete';

const schedulerDeleteTranslations: typeof englishSchedulerDeleteTranslations = {
    'Scheduler.Delete.WaitingJobs.Success': 'Procesy {{ processName }} usunięte z oczekiwania',
    'Scheduler.Delete.WaitingJobs.Failed': 'Usunięcie procesu z oczekiwania{{ processName }} nie powiodło się',
    'Scheduler.Delete.Dialog.Title': 'Usuń {{ processName }}',
    'Scheduler.Delete.Dialog.Confirmation.Message': 'Jesteś pewny, że chcesz usunąć zaplanowany proces ?{{ processName }}',
    'Scheduler.Delete.ScheduledProcess.Success': 'Usunięto zaplanowany proces{{ processName }}',
    'Scheduler.Delete.ScheduledProcess.Failed': 'Usunięcie zaplanowanego procesu nie powiodło się {{ processName }}',
};

export default schedulerDeleteTranslations;
