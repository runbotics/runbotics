package com.runbotics.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

public class BotCollectionCriteria implements Serializable, Criteria {

    private UUIDFilter id;

    private StringFilter name;

    private BooleanFilter publicBotsIncluded;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter updated;

    private LongFilter createdBy;

    private StringFilter createdByName;

    public BotCollectionCriteria() {}

    public BotCollectionCriteria(BotCollectionCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.publicBotsIncluded = other.publicBotsIncluded == null ? null : other.publicBotsIncluded.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.updated = other.updated == null ? null : other.updated.copy();
        this.createdBy = other.createdBy == null ? null : other.createdBy.copy();
        this.createdByName = other.createdByName == null ? null : other.createdByName.copy();
    }

    @Override
    public BotCollectionCriteria copy() {
        return new BotCollectionCriteria(this);
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

    public BooleanFilter getPublicBotsIncluded() {
        return publicBotsIncluded;
    }

    public void setPublicBotsIncluded(BooleanFilter publicBotsIncluded) {
        this.publicBotsIncluded = publicBotsIncluded;
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
        BotCollectionCriteria that = (BotCollectionCriteria) o;
        return (
            id.equals(that.id) &&
            name.equals(that.name) &&
            publicBotsIncluded.equals(that.publicBotsIncluded) &&
            Objects.equals(created, that.created) &&
            Objects.equals(updated, that.updated) &&
            Objects.equals(createdBy, that.createdBy) &&
            Objects.equals(createdByName, that.createdByName)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, publicBotsIncluded, created, updated, createdBy, createdByName);
    }

    @Override
    public String toString() {
        return (
            "BotCollectionCriteria{" +
            "id=" +
            id +
            ", name=" +
            name +
            ", publicBotsIncluded=" +
            publicBotsIncluded +
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
