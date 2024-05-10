package com.runbotics.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.NotNull;
import liquibase.pro.packaged.S;

/**
 * A DTO for the {@link com.runbotics.domain.ScheduleProcess} entity.
 */
public class ScheduleProcessDTO implements Serializable {

    private Long id;

    @NotNull
    private String cron;

    private ProcessDTO process;

    private UserDTO user;

    private String inputVariables;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCron() {
        return cron;
    }

    public void setCron(String cron) {
        this.cron = cron;
    }

    public ProcessDTO getProcess() {
        return process;
    }

    public void setProcess(ProcessDTO process) {
        this.process = process;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getInputVariables() {
        return inputVariables;
    }

    public void setInputVariables(String inputVariables) {
        this.inputVariables = inputVariables;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ScheduleProcessDTO)) {
            return false;
        }

        ScheduleProcessDTO scheduleProcessDTO = (ScheduleProcessDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, scheduleProcessDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ScheduleProcessDTO{" +
            "id=" + getId() +
            ", cron='" + getCron() + "'" +
            ", process=" + getProcess() +
            ", inputVariables=" + getInputVariables() +
            "}";
    }
}
