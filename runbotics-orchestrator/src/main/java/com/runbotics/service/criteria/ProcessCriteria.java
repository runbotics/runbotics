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
import tech.jhipster.service.filter.ZonedDateTimeFilter;

/**
 * Criteria class for the {@link com.runbotics.domain.Process} entity. This class is used
 * in {@link com.runbotics.web.rest.ProcessResource} to receive all the possible filtering options from
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

    private BooleanFilter isPublic;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter updated;

    private LongFilter executionsCount;

    private LongFilter successExecutionsCount;

    private LongFilter failureExecutionsCount;

    private LongFilter createdById;

    private StringFilter createdByName;

    private StringFilter botCollectionName;

    public ProcessCriteria() {}

    public ProcessCriteria(ProcessCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.isPublic = other.isPublic == null ? null : other.isPublic.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.updated = other.updated == null ? null : other.updated.copy();
        this.executionsCount = other.executionsCount == null ? null : other.executionsCount.copy();
        this.successExecutionsCount = other.successExecutionsCount == null ? null : other.successExecutionsCount.copy();
        this.failureExecutionsCount = other.failureExecutionsCount == null ? null : other.failureExecutionsCount.copy();
        this.createdById = other.createdById == null ? null : other.createdById.copy();
        this.createdByName = other.createdByName == null ? null : other.createdByName.copy();
        this.botCollectionName = other.botCollectionName == null ? null : other.botCollectionName.copy();
    }

    @Override
    public ProcessCriteria copy() {
        return new ProcessCriteria(this);
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

    public StringFilter getName() {
        return name;
    }

    public StringFilter name() {
        if (name == null) {
            name = new StringFilter();
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public BooleanFilter getIsPublic() {
        return isPublic;
    }

    public BooleanFilter isPublic() {
        if (isPublic == null) {
            isPublic = new BooleanFilter();
        }
        return isPublic;
    }

    public void setIsPublic(BooleanFilter isPublic) {
        this.isPublic = isPublic;
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

    public LongFilter getExecutionsCount() {
        return executionsCount;
    }

    public LongFilter executionsCount() {
        if (executionsCount == null) {
            executionsCount = new LongFilter();
        }
        return executionsCount;
    }

    public void setExecutionsCount(LongFilter executionsCount) {
        this.executionsCount = executionsCount;
    }

    public LongFilter getSuccessExecutionsCount() {
        return successExecutionsCount;
    }

    public LongFilter successExecutionsCount() {
        if (successExecutionsCount == null) {
            successExecutionsCount = new LongFilter();
        }
        return successExecutionsCount;
    }

    public void setSuccessExecutionsCount(LongFilter successExecutionsCount) {
        this.successExecutionsCount = successExecutionsCount;
    }

    public LongFilter getFailureExecutionsCount() {
        return failureExecutionsCount;
    }

    public LongFilter failureExecutionsCount() {
        if (failureExecutionsCount == null) {
            failureExecutionsCount = new LongFilter();
        }
        return failureExecutionsCount;
    }

    public void setFailureExecutionsCount(LongFilter failureExecutionsCount) {
        this.failureExecutionsCount = failureExecutionsCount;
    }

    public LongFilter getCreatedById() {
        return createdById;
    }

    public LongFilter createdById() {
        if (createdById == null) {
            createdById = new LongFilter();
        }
        return createdById;
    }

    public void setCreatedById(LongFilter createdById) {
        this.createdById = createdById;
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

    public StringFilter botCollectionName() {
        if (botCollectionName == null) {
            botCollectionName = new StringFilter();
        }
        return botCollectionName;
    }

    public StringFilter getBotCollectionName() {
        return botCollectionName;
    }

    public void setBotCollectionName(StringFilter botCollectionName) {
        this.botCollectionName = botCollectionName;
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
            Objects.equals(isPublic, that.isPublic) &&
            Objects.equals(created, that.created) &&
            Objects.equals(updated, that.updated) &&
            Objects.equals(executionsCount, that.executionsCount) &&
            Objects.equals(successExecutionsCount, that.successExecutionsCount) &&
            Objects.equals(failureExecutionsCount, that.failureExecutionsCount) &&
            Objects.equals(createdById, that.createdById) &&
            Objects.equals(createdByName, that.createdByName) &&
            Objects.equals(botCollectionName, that.botCollectionName)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            name,
            isPublic,
            created,
            updated,
            executionsCount,
            successExecutionsCount,
            failureExecutionsCount,
            createdById,
            createdByName,
            botCollectionName
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (isPublic != null ? "isPublic=" + isPublic + ", " : "") +
            (created != null ? "created=" + created + ", " : "") +
            (updated != null ? "updated=" + updated + ", " : "") +
            (executionsCount != null ? "executionsCount=" + executionsCount + ", " : "") +
            (successExecutionsCount != null ? "successExecutionsCount=" + successExecutionsCount + ", " : "") +
            (failureExecutionsCount != null ? "failureExecutionsCount=" + failureExecutionsCount + ", " : "") +
            (createdById != null ? "createdById=" + createdById + ", " : "") +
            "}";
    }
}
