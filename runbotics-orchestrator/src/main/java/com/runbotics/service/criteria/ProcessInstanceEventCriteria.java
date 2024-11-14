package com.runbotics.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.DoubleFilter;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.FloatFilter;
import tech.jhipster.service.filter.IntegerFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.UUIDFilter;
import tech.jhipster.service.filter.ZonedDateTimeFilter;

/**
 * Criteria class for the {@link com.runbotics.domain.ProcessInstanceEvent} entity. This class is used
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

    private StringFilter step;

    private UUIDFilter processInstanceId;

    private StringFilter executionId;

    private ZonedDateTimeFilter finished;

    public ProcessInstanceEventCriteria() {}

    public ProcessInstanceEventCriteria(ProcessInstanceEventCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.step = other.step == null ? null : other.step.copy();
        this.processInstanceId = other.processInstanceId == null ? null : other.processInstanceId.copy();
        this.executionId = other.executionId == null ? null : other.executionId.copy();
        this.finished = other.finished == null ? null : other.finished.copy();
    }

    @Override
    public ProcessInstanceEventCriteria copy() {
        return new ProcessInstanceEventCriteria(this);
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

    public StringFilter getStep() {
        return step;
    }

    public StringFilter step() {
        if (step == null) {
            step = new StringFilter();
        }
        return step;
    }

    public void setStep(StringFilter step) {
        this.step = step;
    }

    public UUIDFilter getProcessInstanceId() {
        return processInstanceId;
    }

    public UUIDFilter processInstanceId() {
        if (processInstanceId == null) {
            processInstanceId = new UUIDFilter();
        }
        return processInstanceId;
    }

    public void setProcessInstanceId(UUIDFilter processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public StringFilter getExecutionId() {
        return executionId;
    }

    public StringFilter executionId() {
        if (executionId == null) {
            executionId = new StringFilter();
        }
        return executionId;
    }

    public void setExecutionId(StringFilter executionId) {
        this.executionId = executionId;
    }

    public ZonedDateTimeFilter getFinished() {
        return finished;
    }

    public ZonedDateTimeFilter finished() {
        if (finished == null) {
            finished = new ZonedDateTimeFilter();
        }
        return finished;
    }

    public void setFinished(ZonedDateTimeFilter finished) {
        this.finished = finished;
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
            Objects.equals(step, that.step) &&
            Objects.equals(processInstanceId, that.processInstanceId) &&
            Objects.equals(executionId, that.executionId) &&
            Objects.equals(finished, that.finished)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, created, step, processInstanceId, executionId, finished);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceEventCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (created != null ? "created=" + created + ", " : "") +
            (step != null ? "step=" + step + ", " : "") +
            (processInstanceId != null ? "processInstanceId=" + processInstanceId + ", " : "") +
            (executionId != null ? "executionId=" + executionId + ", " : "") +
            (finished != null ? "finished=" + finished + ", " : "") +
            "}";
    }
}
