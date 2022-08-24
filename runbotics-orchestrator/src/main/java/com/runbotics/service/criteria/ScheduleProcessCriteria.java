package com.runbotics.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;

/**
 * Criteria class for the {@link com.runbotics.domain.ScheduleProcess} entity. This class is used
 * in {@link com.runbotics.web.rest.ScheduleProcessResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /schedule-processes?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ScheduleProcessCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter cron;

    private LongFilter processId;

    public ScheduleProcessCriteria() {}

    public ScheduleProcessCriteria(ScheduleProcessCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.cron = other.cron == null ? null : other.cron.copy();
        this.processId = other.processId == null ? null : other.processId.copy();
    }

    @Override
    public ScheduleProcessCriteria copy() {
        return new ScheduleProcessCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public LongFilter id() {
        if (id == null) {
            id = new LongFilter();
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getCron() {
        return cron;
    }

    public StringFilter cron() {
        if (cron == null) {
            cron = new StringFilter();
        }
        return cron;
    }

    public void setCron(StringFilter cron) {
        this.cron = cron;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ScheduleProcessCriteria that = (ScheduleProcessCriteria) o;
        return (Objects.equals(id, that.id) && Objects.equals(cron, that.cron) && Objects.equals(processId, that.processId));
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, cron, processId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ScheduleProcessCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (cron != null ? "cron=" + cron + ", " : "") +
            (processId != null ? "processId=" + processId + ", " : "") +
            "}";
    }
}
