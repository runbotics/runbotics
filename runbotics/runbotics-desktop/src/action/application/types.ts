import { DesktopRunRequest } from 'runbotics-sdk';

export type ApplicationActionRequest =
| DesktopRunRequest<'application.launch', ApplicationLaunchActionInput>
| DesktopRunRequest<'application.close', never>;

export interface ApplicationLaunchActionInput {
    location: string;
}
export interface ApplicationLaunchActionOutput {}
