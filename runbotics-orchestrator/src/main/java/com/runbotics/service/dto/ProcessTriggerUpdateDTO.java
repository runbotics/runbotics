package com.runbotics.service.dto;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class ProcessTriggerUpdateDTO implements Serializable {

    @NotNull
    private Long id;


    @NotNull
    private Boolean isTriggerable;

    public ProcessTriggerUpdateDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getTriggerable() {
        return isTriggerable;
    }

    public void setTriggerable(Boolean triggerable) {
        isTriggerable = triggerable;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProcessTriggerUpdateDTO)) return false;
        ProcessTriggerUpdateDTO that = (ProcessTriggerUpdateDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(isTriggerable, that.isTriggerable);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, isTriggerable);
    }

    @Override
    public String toString() {
        return "ProcessTriggerUpdateDTO{" +
            "id=" + id +
            ", isTriggerable=" + isTriggerable +
            '}';
    }
}
