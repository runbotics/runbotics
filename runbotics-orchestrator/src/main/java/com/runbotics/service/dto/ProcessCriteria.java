package com.runbotics.service.dto;

import com.runbotics.domain.Process;
import com.runbotics.web.rest.ProcessResource;
import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.BooleanFilter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.ZonedDateTimeFilter;

/**
 * Criteria class for the {@link Process} entity. This class is used
 * in {@link ProcessResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /processes?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ProcessCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private BooleanFilter shared;

    private BooleanFilter autoStart;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter updated;

    private StringFilter commitId;

    private LongFilter createdById;

    public ProcessCriteria() {}

    public ProcessCriteria(ProcessCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.shared = other.shared == null ? null : other.shared.copy();
        this.autoStart = other.autoStart == null ? null : other.autoStart.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.updated = other.updated == null ? null : other.updated.copy();
        this.commitId = other.commitId == null ? null : other.commitId.copy();
        this.createdById = other.createdById == null ? null : other.createdById.copy();
    }

    @Override
    public ProcessCriteria copy() {
        return new ProcessCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public BooleanFilter getShared() {
        return shared;
    }

    public void setShared(BooleanFilter shared) {
        this.shared = shared;
    }

    public BooleanFilter getAutoStart() {
        return autoStart;
    }

    public void setAutoStart(BooleanFilter autoStart) {
        this.autoStart = autoStart;
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

    public StringFilter getCommitId() {
        return commitId;
    }

    public void setCommitId(StringFilter commitId) {
        this.commitId = commitId;
    }

    public LongFilter getCreatedById() {
        return createdById;
    }

    public void setCreatedById(LongFilter createdById) {
        this.createdById = createdById;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ProcessCriteria that = (ProcessCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(shared, that.shared) &&
            Objects.equals(autoStart, that.autoStart) &&
            Objects.equals(created, that.created) &&
            Objects.equals(updated, that.updated) &&
            Objects.equals(commitId, that.commitId) &&
            Objects.equals(createdById, that.createdById)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, shared, autoStart, created, updated, commitId, createdById);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (name != null ? "name=" + name + ", " : "") +
                (shared != null ? "shared=" + shared + ", " : "") +
                (autoStart != null ? "autoStart=" + autoStart + ", " : "") +
                (created != null ? "created=" + created + ", " : "") +
                (updated != null ? "updated=" + updated + ", " : "") +
                (commitId != null ? "commitId=" + commitId + ", " : "") +
                (createdById != null ? "createdById=" + createdById + ", " : "") +
            "}";
    }
}
