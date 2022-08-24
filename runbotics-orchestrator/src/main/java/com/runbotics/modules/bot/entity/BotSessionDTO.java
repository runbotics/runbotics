package com.runbotics.modules.bot.entity;

import com.runbotics.service.dto.BotDTO;

public class BotSessionDTO {

    private String sessionId;
    private boolean isConnected = false;
    private BotDTO bot;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean isConnected() {
        return isConnected;
    }

    public void setConnected(boolean connected) {
        isConnected = connected;
    }

    public BotDTO getBot() {
        return bot;
    }

    public void setBot(BotDTO bot) {
        this.bot = bot;
    }
}
