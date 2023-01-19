import { DesktopRunRequest } from 'runbotics-sdk';

export type AsanaActionRequest = 
| DesktopRunRequest<'asana.test', never>;

export type AsanaSendActionOutput = any;
