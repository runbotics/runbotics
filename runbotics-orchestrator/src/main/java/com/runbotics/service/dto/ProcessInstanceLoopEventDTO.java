package com.runbotics.service.dto;

import com.runbotics.modules.bot.entity.ProcessInstanceEventStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.runbotics.domain.ProcessInstanceEvent} entity.
 */
public class ProcessInstanceLoopEventDTO implements Serializable {

    private Long id;

    private ZonedDateTime created;

    @Lob
    private String log;

    private String step;

    private ProcessInstanceDTO processInstance;

    private String executionId;

    private String script;

    @Lob
    private String input;

    @Lob
    private String output;

    private ZonedDateTime finished;

    private ProcessInstanceEventStatus status;

    private String error;

    private String iterationNumber;

    private String iterationElement;

    private String loopId;

    public String getIterationNumber() {
        return iterationNumber;
    }

    public void setIterationNumber(String iterationNumber) {
        this.iterationNumber = iterationNumber;
    }

    public String getIterationElement() {
        return iterationElement;
    }

    public void setIterationElement(String iterationElement) {
        this.iterationElement = iterationElement;
    }

    public String getLoopId() {
        return loopId;
    }

    public void setLoopId(String loopId) {
        this.loopId = loopId;
    }

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

    public String getScript() {
        return script;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public void setScript(String script) {
        this.script = script;
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
        if (!(o instanceof ProcessInstanceLoopEventDTO)) {
            return false;
        }

        ProcessInstanceLoopEventDTO ProcessInstanceLoopEventDTO = (ProcessInstanceLoopEventDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, ProcessInstanceLoopEventDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceLoopEventDTO{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", log='" + getLog() + "'" +
            ", step='" + getStep() + "'" +
            ", processInstance='" + getProcessInstance() + "'" +
            ", executionId='" + getExecutionId() + "'" +
            ", iterationElement='" + getIterationElement() + "'" +
            ", iterationNumber='" + getIterationNumber() + "'" +
            ", loopId='" + getLoopId() + "'" +
            ", script='" + getScript() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", finished='" + getFinished() + "'" +
            ", status='" + getStatus() + "'" +
            ", error='" + getError() + "'" +
            "}";
    }
}
