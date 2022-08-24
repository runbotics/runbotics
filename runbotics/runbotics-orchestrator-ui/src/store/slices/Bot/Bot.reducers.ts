import { PayloadAction } from '@reduxjs/toolkit';
import { IBot } from 'runbotics-common';
import { BotState } from './Bot.state';

export const updateBot = (state: BotState, action: PayloadAction<IBot>) => {
    const updatedBot = action.payload;
    const botIndex = state.bots.page?.content.findIndex((bot) => bot.installationId === updatedBot.installationId);
    state.bots.page.content[botIndex] = updatedBot;
    state.bots.byId[updatedBot.id] = updatedBot;
};

export const deleteBot = (state: BotState, action: PayloadAction<IBot['id']>) => {
    delete state.bots.page.content[action.payload];
    delete state.bots.allIds[action.payload];
};
