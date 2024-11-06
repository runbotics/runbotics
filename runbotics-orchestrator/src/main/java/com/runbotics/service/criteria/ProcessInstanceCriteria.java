package com.runbotics.service.criteria;

import com.runbotics.modules.bot.entity.ProcessInstanceStatus;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.runbotics.domain.ProcessInstance} entity. This class is used
 * to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /process-instances?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ProcessInstanceCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private UUIDFilter id;

    private UUIDFilter rootProcessInstanceId;

    private StringFilter orchestratorProcessInstanceId;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter updated;

    private StringFilter step;

    private LongFilter processId;

    private LongFilter botId;

    private BooleanFilter scheduled;

    private StringFilter processName;

    private StringFilter botInstallationId;

    private List<ProcessInstanceStatus> status;

    private StringFilter createdByName;

    public ProcessInstanceCriteria() {}

    public ProcessInstanceCriteria(ProcessInstanceCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.rootProcessInstanceId = other.rootProcessInstanceId == null ? null : other.rootProcessInstanceId.copy();
        this.orchestratorProcessInstanceId =
            other.orchestratorProcessInstanceId == null ? null : other.orchestratorProcessInstanceId.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.updated = other.updated == null ? null : other.updated.copy();
        this.step = other.step == null ? null : other.step.copy();
        this.processId = other.processId == null ? null : other.processId.copy();
        this.botId = other.botId == null ? null : other.botId.copy();
        this.scheduled = other.scheduled == null ? null : other.scheduled.copy();
        this.processName = other.processName == null ? null : other.processName.copy();
        this.botInstallationId = other.botInstallationId == null ? null : other.botInstallationId.copy();
        this.status = other.status == null ? null : other.status;
        this.createdByName = other.createdByName == null ? null : other.createdByName.copy();
    }

    @Override
    public ProcessInstanceCriteria copy() {
        return new ProcessInstanceCriteria(this);
    }

    public UUIDFilter getId() {
        return id;
    }

    public UUIDFilter id() {
        if (id == null) {
            id = new UUIDFilter();
        }
        return id;
    }

    public UUIDFilter getRootProcessInstanceId() {
        return rootProcessInstanceId;
    }

    public UUIDFilter rootProcessInstanceId() {
        if (rootProcessInstanceId == null) {
            rootProcessInstanceId = new UUIDFilter();
        }
        return rootProcessInstanceId;
    }

    public void setId(UUIDFilter id) {
        this.id = id;
    }

    public StringFilter getOrchestratorProcessInstanceId() {
        return orchestratorProcessInstanceId;
    }

    public StringFilter orchestratorProcessInstanceId() {
        if (orchestratorProcessInstanceId == null) {
            orchestratorProcessInstanceId = new StringFilter();
        }
        return orchestratorProcessInstanceId;
    }

    public void setOrchestratorProcessInstanceId(StringFilter orchestratorProcessInstanceId) {
        this.orchestratorProcessInstanceId = orchestratorProcessInstanceId;
    }

    public ZonedDateTimeFilter getCreated() {
        return created;
    }

    public ZonedDateTimeFilter created() {
        if (created == null) {
            created = new ZonedDateTimeFilter();
        }
        return created;
    }

    public void setCreated(ZonedDateTimeFilter created) {
        this.created = created;
    }

    public ZonedDateTimeFilter getUpdated() {
        return updated;
    }

    public ZonedDateTimeFilter updated() {
        if (updated == null) {
            updated = new ZonedDateTimeFilter();
        }
        return updated;
    }

    public void setUpdated(ZonedDateTimeFilter updated) {
        this.updated = updated;
    }

    public StringFilter getStep() {
        return step;
    }

    public StringFilter step() {
        if (step == null) {
            step = new StringFilter();
        }
        return step;
    }

    public List<ProcessInstanceStatus> getStatus() {
        return status;
    }

    public List<ProcessInstanceStatus> status() {
        return status;
    }

    public LongFilter getProcessId() {
        return processId;
    }

    public LongFilter processId() {
        if (processId == null) {
            processId = new LongFilter();
        }
        return processId;
    }

    public void setProcessId(LongFilter processId) {
        this.processId = processId;
    }

    public LongFilter getBotId() {
        return botId;
    }

    public LongFilter botId() {
        if (botId == null) {
            botId = new LongFilter();
        }
        return botId;
    }

    public void setBotId(LongFilter botId) {
        this.botId = botId;
    }

    public void setStep(StringFilter step) {
        this.step = step;
    }

    public void setStatus(List<ProcessInstanceStatus> status) {
        this.status = status;
    }

    public BooleanFilter getScheduled() {
        return scheduled;
    }

    public void setScheduled(BooleanFilter scheduled) {
        this.scheduled = scheduled;
    }

    public StringFilter getProcessName() {
        return processName;
    }

    public StringFilter processName() {
        if (processName == null) {
            processName = new StringFilter();
        }
        return processName;
    }

    public void setProcessName(StringFilter processName) {
        this.processName = processName;
    }

    public StringFilter getBotInstallationId() {
        return botInstallationId;
    }

    public StringFilter botInstallationId() {
        if (botInstallationId == null) {
            botInstallationId = new StringFilter();
        }
        return botInstallationId;
    }

    public void setBotInstallationId(StringFilter botInstallationId) {
        this.botInstallationId = botInstallationId;
    }

    public StringFilter getCreatedByName() {
        return createdByName;
    }

    public StringFilter createdByName() {
        if (createdByName == null) {
            createdByName = new StringFilter();
        }
        return createdByName;
    }

    public void setCreatedByName(StringFilter createdByName) {
        this.createdByName = createdByName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ProcessInstanceCriteria that = (ProcessInstanceCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(rootProcessInstanceId, that.rootProcessInstanceId) &&
            Objects.equals(orchestratorProcessInstanceId, that.orchestratorProcessInstanceId) &&
            Objects.equals(created, that.created) &&
            Objects.equals(updated, that.updated) &&
            Objects.equals(step, that.step) &&
            Objects.equals(processId, that.processId) &&
            Objects.equals(botId, that.botId) &&
            Objects.equals(scheduled, that.scheduled) &&
            Objects.equals(processName, that.processName) &&
            Objects.equals(botInstallationId, that.botInstallationId) &&
            Objects.equals(status, that.status) &&
            Objects.equals(botInstallationId, that.botInstallationId) &&
            Objects.equals(createdByName, that.createdByName) &&
            Objects.equals(createdByName, that.createdByName)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            rootProcessInstanceId,
            orchestratorProcessInstanceId,
            created,
            updated,
            step,
            processId,
            botId,
            processName,
            botInstallationId,
            createdByName,
            createdByName,
            status,
            botInstallationId
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (rootProcessInstanceId != null ? "rootProcessInstanceId=" + rootProcessInstanceId + ", " : "") +
            (orchestratorProcessInstanceId != null ? "orchestratorProcessInstanceId=" + orchestratorProcessInstanceId + ", " : "") +
            (created != null ? "created=" + created + ", " : "") +
            (updated != null ? "updated=" + updated + ", " : "") +
            (step != null ? "step=" + step + ", " : "") +
            (processId != null ? "processId=" + processId + ", " : "") +
            (botId != null ? "botId=" + botId + ", " : "") +
            (status != null ? "status=" + status + ", " : "") +
            (scheduled != null ? "scheduled=" + scheduled + ", " : "") +
            "}";
    }
}
