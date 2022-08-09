import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import process, {
  ProcessState
} from 'app/entities/process/process.reducer';
// prettier-ignore
// prettier-ignore
// prettier-ignore
// prettier-ignore
import bot, {
  BotState
} from 'app/entities/bot/bot.reducer';
// prettier-ignore
import scheduleProcess, {
  ScheduleProcessState
} from 'app/entities/schedule-process/schedule-process.reducer';
// prettier-ignore
import processInstance, {
  ProcessInstanceState
} from 'app/entities/process-instance/process-instance.reducer';
// prettier-ignore
import processInstanceEvent, {
  ProcessInstanceEventState
} from 'app/entities/process-instance-event/process-instance-event.reducer';
// prettier-ignore
import activity, {
  ActivityState
} from 'app/entities/activity/activity.reducer';
// prettier-ignore
import action, {
  ActionState
} from 'app/entities/action/action.reducer';
// prettier-ignore
import documentationPage, {
  DocumentationPageState
} from 'app/entities/documentation-page/documentation-page.reducer';
import globalVariable, { GlobalVariableState } from 'app/entities/global-variable/global-variable.reducer';

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly process: ProcessState;
  readonly bot: BotState;
  readonly scheduleProcess: ScheduleProcessState;
  readonly processInstance: ProcessInstanceState;
  readonly processInstanceEvent: ProcessInstanceEventState;
  readonly activity: ActivityState;
  readonly action: ActionState;
  readonly documentationPage: DocumentationPageState;
  readonly globalVariable: GlobalVariableState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  process,
  bot,
  scheduleProcess,
  processInstance,
  processInstanceEvent,
  activity,
  action,
  documentationPage,
  globalVariable,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar,
});

export default rootReducer;
