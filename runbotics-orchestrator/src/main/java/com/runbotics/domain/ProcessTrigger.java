package com.runbotics.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "process_trigger")
public class ProcessTrigger {

    @NotNull
    @Id
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    public ProcessTriggerName name;

    public ProcessTrigger() {}

    public ProcessTrigger(ProcessTriggerName name) {
        this.name = name;
    }

    public ProcessTriggerName getName() {
        return name;
    }

    public void setName(ProcessTriggerName name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessTrigger processTrigger = (ProcessTrigger) o;
        return Objects.equals(name, processTrigger.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "ProcessTrigger{" + "name='" + name + '\'' + '}';
    }

}
