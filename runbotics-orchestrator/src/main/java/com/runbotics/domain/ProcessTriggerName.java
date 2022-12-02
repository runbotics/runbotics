package com.runbotics.domain;

public enum ProcessTriggerName {
    MANUAL("MANUAL"),
    SCHEDULER("SCHEDULER"),
    API("API"),
    EMAIL("EMAIL");

    private final String name;

    ProcessTriggerName(String name) {
        this.name = name;
    }

    public String value() {
        return this.name;
    }
}
