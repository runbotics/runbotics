package com.runbotics.service.dto;

import com.runbotics.modules.bot.entity.ProcessInstanceEventStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.runbotics.domain.ProcessInstanceEvent} entity.
 */
public class ProcessInstanceEventDTO implements Serializable {

    private Long id;

    private ZonedDateTime created;

    @Lob
    private String log;

    private String step;

    private ProcessInstanceDTO processInstance;

    private String executionId;

    @Lob
    private String input;

    @Lob
    private String output;

    private ZonedDateTime finished;

    private ProcessInstanceEventStatus status;

    private String error;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public String getLog() {
        return log;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public ProcessInstanceDTO getProcessInstance() {
        return processInstance;
    }

    public void setProcessInstance(ProcessInstanceDTO processInstance) {
        this.processInstance = processInstance;
    }

    public String getExecutionId() {
        return executionId;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public ZonedDateTime getFinished() {
        return finished;
    }

    public void setFinished(ZonedDateTime finished) {
        this.finished = finished;
    }

    public ProcessInstanceEventStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessInstanceEventStatus status) {
        this.status = status;
    }

    public String getError() {
        return this.error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProcessInstanceEventDTO)) {
            return false;
        }

        ProcessInstanceEventDTO processInstanceEventDTO = (ProcessInstanceEventDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, processInstanceEventDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceEventDTO{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", log='" + getLog() + "'" +
            ", step='" + getStep() + "'" +
            ", processInstance='" + getProcessInstance() + "'" +
            ", executionId='" + getExecutionId() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", finished='" + getFinished() + "'" +
            ", status='" + getStatus() + "'" +
            ", error='" + getError() + "'" +
            "}";
    }
}
