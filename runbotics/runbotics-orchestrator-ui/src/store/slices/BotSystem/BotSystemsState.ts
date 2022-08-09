import { IBotSystem } from "runbotics-common";

export interface BotSystemsState {
    loading: boolean;
    botSystems: IBotSystem[];
}
