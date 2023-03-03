package com.runbotics.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "trigger_event")
public class TriggerEvent {

    @NotNull
    @Id
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    public TriggerEventName name;

    public TriggerEvent() {}

    public TriggerEvent(TriggerEventName name) {
        this.name = name;
    }

    public TriggerEventName getName() {
        return name;
    }

    public void setName(TriggerEventName name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TriggerEvent triggerEvent = (TriggerEvent) o;
        return Objects.equals(name, triggerEvent.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "TriggerEvent{" + "name='" + name + '\'' + '}';
    }

}
