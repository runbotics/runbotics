package com.runbotics.service.dto;

import com.runbotics.domain.ProcessInstance;
import com.runbotics.domain.ProcessTrigger;
import com.runbotics.modules.bot.entity.ProcessInstanceStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.runbotics.domain.ProcessInstance} entity.
 */
public class ProcessInstanceDTO implements Serializable {

    private UUID id;

    private UUID rootProcessInstanceId;

    private String orchestratorProcessInstanceId;

    private ProcessInstanceStatus status;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    @Lob
    private String input;

    @Lob
    private String output;

    private String step;

    private UserDTO user;

    private ProcessDTO process;

    private BotDTO bot;

    private Set<ProcessInstance> subProcesses;

    private String error;

    private ProcessTrigger trigger;

    private String triggeredBy;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRootProcessInstanceId() {
        return rootProcessInstanceId;
    }

    public void setRootProcessInstanceId(UUID rootProcessInstanceId) {
        this.rootProcessInstanceId = rootProcessInstanceId;
    }

    public String getOrchestratorProcessInstanceId() {
        return orchestratorProcessInstanceId;
    }

    public void setOrchestratorProcessInstanceId(String orchestratorProcessInstanceId) {
        this.orchestratorProcessInstanceId = orchestratorProcessInstanceId;
    }

    public ProcessInstanceStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessInstanceStatus status) {
        this.status = status;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
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

    public String getStep() {
        return step;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public ProcessDTO getProcess() {
        return process;
    }

    public void setProcess(ProcessDTO process) {
        this.process = process;
    }

    public BotDTO getBot() {
        return bot;
    }

    public void setBot(BotDTO bot) {
        this.bot = bot;
    }

    public Set<ProcessInstance> getSubProcesses() {
        return subProcesses;
    }

    public void setSubProcesses(Set<ProcessInstance> subProcesses) {
        this.subProcesses = subProcesses;
    }

    public String getError() {
        return this.error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public ProcessTrigger getTrigger() {
        return trigger;
    }

    public void setTrigger(ProcessTrigger trigger) {
        this.trigger = trigger;
    }

    public String getTriggeredBy() {
        return triggeredBy;
    }

    public void setTriggeredBy(String triggeredBy) {
        this.triggeredBy = triggeredBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProcessInstanceDTO)) {
            return false;
        }

        ProcessInstanceDTO processInstanceDTO = (ProcessInstanceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, processInstanceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceDTO{" +
            "id='" + getId() + "'" +
            ", parentId='" + getRootProcessInstanceId() + "'" +
            ", orchestratorProcessInstanceId='" + getOrchestratorProcessInstanceId() + "'" +
            ", status='" + getStatus() + "'" +
            ", created='" + getCreated() + "'" +
            ", updated='" + getUpdated() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", step='" + getStep() + "'" +
            ", process=" + getProcess() +
            ", bot=" + getBot() +
            ", error=" + getError() +
            ", trigger=" + getTrigger() +
            ", triggeredBy=" + getTriggeredBy() +
            "}";
    }
}
