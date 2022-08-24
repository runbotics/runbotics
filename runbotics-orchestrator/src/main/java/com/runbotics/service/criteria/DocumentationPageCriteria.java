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
 * Criteria class for the {@link com.runbotics.domain.DocumentationPage} entity. This class is used
 * in {@link com.runbotics.web.rest.DocumentationPageResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /documentation-pages?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class DocumentationPageCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    public DocumentationPageCriteria() {}

    public DocumentationPageCriteria(DocumentationPageCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.title = other.title == null ? null : other.title.copy();
    }

    @Override
    public DocumentationPageCriteria copy() {
        return new DocumentationPageCriteria(this);
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

    public StringFilter getTitle() {
        return title;
    }

    public StringFilter title() {
        if (title == null) {
            title = new StringFilter();
        }
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final DocumentationPageCriteria that = (DocumentationPageCriteria) o;
        return Objects.equals(id, that.id) && Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DocumentationPageCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (title != null ? "title=" + title + ", " : "") +
            "}";
    }
}
