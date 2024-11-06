package com.runbotics.service.criteria;

import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.Filter;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.ZonedDateTimeFilter;

import java.io.Serializable;
import java.util.Objects;

/**
 * Criteria class for the {@link com.runbotics.domain.Bot} entity. This class is used
 * to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /bots?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class BotCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter installationId;

    private ZonedDateTimeFilter created;

    private ZonedDateTimeFilter lastConnected;

    private LongFilter userId;

    private StringFilter status;

    private StringFilter collection;

    private StringFilter version;

    public BotCriteria() {}

    public BotCriteria(BotCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.installationId = other.installationId == null ? null : other.installationId.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.lastConnected = other.lastConnected == null ? null : other.lastConnected.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.status = other.status == null ? null : other.status.copy();
        this.collection = other.collection == null ? null : other.collection.copy();
        this.version = other.version == null ? null : other.version.copy();
    }

    @Override
    public BotCriteria copy() {
        return new BotCriteria(this);
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

    public StringFilter getInstallationId() {
        return installationId;
    }

    public StringFilter installationId() {
        if (installationId == null) {
            installationId = new StringFilter();
        }
        return installationId;
    }

    public void setInstallationId(StringFilter installationId) {
        this.installationId = installationId;
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

    public ZonedDateTimeFilter getLastConnected() {
        return lastConnected;
    }

    public ZonedDateTimeFilter lastConnected() {
        if (lastConnected == null) {
            lastConnected = new ZonedDateTimeFilter();
        }
        return lastConnected;
    }

    public void setLastConnected(ZonedDateTimeFilter lastConnected) {
        this.lastConnected = lastConnected;
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

    public StringFilter getStatus() {
        return status;
    }

    public StringFilter status() {
        if (status == null) {
            status = new StringFilter();
        }
        return status;
    }

    public void setStatus(StringFilter status) {
        this.status = status;
    }

    public StringFilter getCollection() {
        return collection;
    }

    public void setCollection(StringFilter collection) {
        this.collection = collection;
    }

    public StringFilter getVersion() {
        return version;
    }

    public void setVersion(StringFilter version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final BotCriteria that = (BotCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(installationId, that.installationId) &&
            Objects.equals(created, that.created) &&
            Objects.equals(lastConnected, that.lastConnected) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(status, that.status) &&
            Objects.equals(collection, that.collection) &&
            Objects.equals(version, that.version)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, installationId, created, lastConnected, userId, status, collection, version);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BotCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (installationId != null ? "installationId=" + installationId + ", " : "") +
            (created != null ? "created=" + created + ", " : "") +
            (lastConnected != null ? "lastConnected=" + lastConnected + ", " : "") +
            (userId != null ? "userId=" + userId + ", " : "") +
            (status != null ? "status=" + status + ", ": "") +
            (collection != null ? "collection=" + collection + ", ": "") +
            (version != null ? "version=" + version + ", ": "") +
            "}";
    }
}
