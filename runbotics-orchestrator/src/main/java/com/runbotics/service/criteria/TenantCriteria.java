package com.runbotics.service.criteria;

import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.UUIDFilter;

import java.io.Serializable;
import java.util.Objects;

public class TenantCriteria implements Serializable, Criteria {
    private static final long serialVersionUID = 1L;

    private UUIDFilter id;

    private StringFilter name;

    public TenantCriteria() {}

    public TenantCriteria(TenantCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.name = other.name == null ? null : other.name.copy();
    }

    @Override
    public TenantCriteria copy() {
        return new TenantCriteria(this);
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final TenantCriteria that = (TenantCriteria) o;
        return (
            Objects.equals(id, that.id) &&
                Objects.equals(name, that.name)
        );
    }

    @Override
    public int hashCode() { return Objects.hash(id, name); }

    @Override
    public String toString() {
        return "TenantCriteria{" +
            (id != null ? "id=" + id + ", " : " ") +
            (name != null ? "email=" + name + ", " : " ") +
            "}";
    }
}
