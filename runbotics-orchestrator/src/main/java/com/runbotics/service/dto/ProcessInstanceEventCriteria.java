package com.runbotics.service.dto;

import java.io.Serializable;
import java.util.Objects;

import com.runbotics.domain.ProcessInstanceEvent;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.ZonedDateTimeFilter;

/**
 * Criteria class for the {@link ProcessInstanceEvent} entity. This class is used
 * to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /process-instance-events?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ProcessInstanceEventCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private ZonedDateTimeFilter created;

    private LongFilter processInstanceId;

    public ProcessInstanceEventCriteria() {}

    public ProcessInstanceEventCriteria(ProcessInstanceEventCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.processInstanceId = other.processInstanceId == null ? null : other.processInstanceId.copy();
    }

    @Override
    public ProcessInstanceEventCriteria copy() {
        return new ProcessInstanceEventCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public ZonedDateTimeFilter getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTimeFilter created) {
        this.created = created;
    }

    public LongFilter getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(LongFilter processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ProcessInstanceEventCriteria that = (ProcessInstanceEventCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(created, that.created) &&
            Objects.equals(processInstanceId, that.processInstanceId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, created, processInstanceId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceEventCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (created != null ? "created=" + created + ", " : "") +
                (processInstanceId != null ? "processInstanceId=" + processInstanceId + ", " : "") +
            "}";
    }
}
