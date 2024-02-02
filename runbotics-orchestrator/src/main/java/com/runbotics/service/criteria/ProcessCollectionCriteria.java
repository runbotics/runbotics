package com.runbotics.service.criteria;

import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

import java.io.Serializable;
import java.util.Objects;

public class ProcessCollectionCriteria implements Serializable, Criteria {

    private UUIDFilter id;

    private StringFilter name;

    private BooleanFilter isPublic;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter updated;

    private LongFilter createdBy;

    private StringFilter createdByName;

    private UUIDFilter parentId;

    public ProcessCollectionCriteria(ProcessCollectionCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.isPublic = other.isPublic == null ? null : other.isPublic.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.updated = other.updated == null ? null : other.updated.copy();
        this.createdBy = other.createdBy == null ? null : other.createdBy.copy();
        this.createdByName = other.createdByName == null ? null : other.createdByName.copy();
    }

    @Override
    public ProcessCollectionCriteria copy() {
        return new ProcessCollectionCriteria(this);
    }

    public UUIDFilter getId() {
        return id;
    }

    public void setId(UUIDFilter id) {
        this.id = id;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public BooleanFilter getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(BooleanFilter isPublic) {
        this.isPublic = isPublic;
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

    public LongFilter getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(LongFilter createdBy) {
        this.createdBy = createdBy;
    }

    public UUIDFilter getParentId() {
        return parentId;
    }

    public void setParentId(UUIDFilter parentId) {
        this.parentId = parentId;
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
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProcessCollectionCriteria that = (ProcessCollectionCriteria) o;
        return (
            id.equals(that.id) &&
            name.equals(that.name) &&
            isPublic.equals(that.isPublic) &&
            Objects.equals(created, that.created) &&
            Objects.equals(updated, that.updated) &&
            Objects.equals(createdBy, that.createdBy) &&
            Objects.equals(createdByName, that.createdByName)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, isPublic, created, updated, createdBy, createdByName);
    }

    @Override
    public String toString() {
        return (
            "BotCollectionCriteria{" +
            "id=" +
            id +
            ", name=" +
            name +
            ", isPublic=" +
            isPublic +
            ", created=" +
            created +
            ", updated=" +
            updated +
            ", createdBy=" +
            createdBy +
            '}'
        );
    }
}
