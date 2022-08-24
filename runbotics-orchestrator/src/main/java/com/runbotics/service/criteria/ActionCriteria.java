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

/**
 * Criteria class for the {@link com.runbotics.domain.Action} entity. This class is used
 * in {@link com.runbotics.web.rest.ActionResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /actions?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ActionCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private StringFilter id;

    private StringFilter label;

    private StringFilter script;

    public ActionCriteria() {}

    public ActionCriteria(ActionCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.label = other.label == null ? null : other.label.copy();
        this.script = other.script == null ? null : other.script.copy();
    }

    @Override
    public ActionCriteria copy() {
        return new ActionCriteria(this);
    }

    public StringFilter getId() {
        return id;
    }

    public StringFilter id() {
        if (id == null) {
            id = new StringFilter();
        }
        return id;
    }

    public void setId(StringFilter id) {
        this.id = id;
    }

    public StringFilter getLabel() {
        return label;
    }

    public StringFilter label() {
        if (label == null) {
            label = new StringFilter();
        }
        return label;
    }

    public void setLabel(StringFilter label) {
        this.label = label;
    }

    public StringFilter getScript() {
        return script;
    }

    public StringFilter script() {
        if (script == null) {
            script = new StringFilter();
        }
        return script;
    }

    public void setScript(StringFilter script) {
        this.script = script;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ActionCriteria that = (ActionCriteria) o;
        return Objects.equals(id, that.id) && Objects.equals(label, that.label) && Objects.equals(script, that.script);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, label, script);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ActionCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (label != null ? "label=" + label + ", " : "") +
            (script != null ? "script=" + script + ", " : "") +
            "}";
    }
}
