package com.runbotics.modules.bot.entity;

public enum BotStatus {
    DISCONNECTED("DISCONNECTED"),
    CONNECTED("CONNECTED"),
    BUSY("BUSY");

    private final String value;

    BotStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    @Override
    public String toString() {
        return value;
    }
}
