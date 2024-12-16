package com.runbotics.service.dto;

import java.io.Serializable;
import java.util.Objects;

import com.runbotics.domain.ProcessInstance;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.ZonedDateTimeFilter;

/**
 * Criteria class for the {@link ProcessInstance} entity. This class is used
 * to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /process-instances?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ProcessInstanceCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter externalId;

    private StringFilter status;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter updated;

    private LongFilter processId;

    private LongFilter botId;

    public ProcessInstanceCriteria() {}

    public ProcessInstanceCriteria(ProcessInstanceCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.externalId = other.externalId == null ? null : other.externalId.copy();
        this.status = other.status == null ? null : other.status.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.updated = other.updated == null ? null : other.updated.copy();
        this.processId = other.processId == null ? null : other.processId.copy();
        this.botId = other.botId == null ? null : other.botId.copy();
    }

    @Override
    public ProcessInstanceCriteria copy() {
        return new ProcessInstanceCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getExternalId() {
        return externalId;
    }

    public void setExternalId(StringFilter externalId) {
        this.externalId = externalId;
    }

    public StringFilter getStatus() {
        return status;
    }

    public void setStatus(StringFilter status) {
        this.status = status;
    }

    public ZonedDateTimeFilter getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTimeFilter created) {
        this.created = created;
    }

    public ZonedDateTimeFilter getUpdated() {
        return updated;
    }

    public void setUpdated(ZonedDateTimeFilter updated) {
        this.updated = updated;
    }

    public LongFilter getProcessId() {
        return processId;
    }

    public void setProcessId(LongFilter processId) {
        this.processId = processId;
    }

    public LongFilter getBotId() {
        return botId;
    }

    public void setBotId(LongFilter botId) {
        this.botId = botId;
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
            Objects.equals(externalId, that.externalId) &&
            Objects.equals(status, that.status) &&
            Objects.equals(created, that.created) &&
            Objects.equals(updated, that.updated) &&
            Objects.equals(processId, that.processId) &&
            Objects.equals(botId, that.botId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, externalId, status, created, updated, processId, botId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (externalId != null ? "externalId=" + externalId + ", " : "") +
                (status != null ? "status=" + status + ", " : "") +
                (created != null ? "created=" + created + ", " : "") +
                (updated != null ? "updated=" + updated + ", " : "") +
                (processId != null ? "processId=" + processId + ", " : "") +
                (botId != null ? "botId=" + botId + ", " : "") +
            "}";
    }
}
