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
 * Criteria class for the {@link com.runbotics.domain.GlobalVariable} entity. This class is used
 * in {@link com.runbotics.web.rest.GlobalVariableResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /global-variables?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class GlobalVariableCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private StringFilter description;

    private StringFilter type;

    private StringFilter value;

    private ZonedDateTimeFilter lastModified;

    private LongFilter userId;

    public GlobalVariableCriteria() {}

    public GlobalVariableCriteria(GlobalVariableCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
        this.description = other.description == null ? null : other.description.copy();
        this.type = other.type == null ? null : other.type.copy();
        this.value = other.value == null ? null : other.value.copy();
        this.lastModified = other.lastModified == null ? null : other.lastModified.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
    }

    @Override
    public GlobalVariableCriteria copy() {
        return new GlobalVariableCriteria(this);
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

    public StringFilter getDescription() {
        return description;
    }

    public StringFilter description() {
        if (description == null) {
            description = new StringFilter();
        }
        return description;
    }

    public void setDescription(StringFilter description) {
        this.description = description;
    }

    public StringFilter getType() {
        return type;
    }

    public StringFilter type() {
        if (type == null) {
            type = new StringFilter();
        }
        return type;
    }

    public void setType(StringFilter type) {
        this.type = type;
    }

    public StringFilter getValue() {
        return value;
    }

    public StringFilter value() {
        if (value == null) {
            value = new StringFilter();
        }
        return value;
    }

    public void setValue(StringFilter value) {
        this.value = value;
    }

    public ZonedDateTimeFilter getLastModified() {
        return lastModified;
    }

    public ZonedDateTimeFilter lastModified() {
        if (lastModified == null) {
            lastModified = new ZonedDateTimeFilter();
        }
        return lastModified;
    }

    public void setLastModified(ZonedDateTimeFilter lastModified) {
        this.lastModified = lastModified;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public LongFilter userId() {
        if (userId == null) {
            userId = new LongFilter();
        }
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final GlobalVariableCriteria that = (GlobalVariableCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(name, that.name) &&
            Objects.equals(description, that.description) &&
            Objects.equals(type, that.type) &&
            Objects.equals(value, that.value) &&
            Objects.equals(lastModified, that.lastModified) &&
            Objects.equals(userId, that.userId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, type, value, lastModified, userId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GlobalVariableCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (description != null ? "description=" + description + ", " : "") +
            (type != null ? "type=" + type + ", " : "") +
            (value != null ? "value=" + value + ", " : "") +
            (lastModified != null ? "lastModified=" + lastModified + ", " : "") +
            (userId != null ? "userId=" + userId + ", " : "") +
            "}";
    }
}
