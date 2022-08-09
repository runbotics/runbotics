package com.runbotics.modules.bot.entity;

public enum ProcessInstanceEventStatus {
    IN_PROGRESS("IN_PROGRESS"),
    COMPLETED("COMPLETED"),
    ERRORED("ERRORED"),
    STOPPED("STOPPED"),
    TERMINATED("TERMINATED");

    private final String value;

    ProcessInstanceEventStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
}
