package com.runbotics.domain;

public enum TriggerEventName {
    MANUAL("MANUAL"),
    SCHEDULER("SCHEDULER"),
    API("API"),
    EMAIL("EMAIL");

    private final String name;

    TriggerEventName(String name) {
        this.name = name;
    }

    public String value() {
        return this.name;
    }
}
