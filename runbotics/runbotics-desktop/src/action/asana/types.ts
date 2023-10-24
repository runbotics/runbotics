import { DesktopRunRequest } from '@runbotics/runbotics-sdk';

export type AsanaActionRequest = 
| DesktopRunRequest<'asana.test', never>;

export type AsanaSendActionOutput = any;
