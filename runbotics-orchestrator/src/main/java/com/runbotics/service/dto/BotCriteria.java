package com.runbotics.service.dto;

import java.io.Serializable;
import java.util.Objects;

import com.runbotics.domain.Bot;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.service.filter.StringFilter;
import tech.jhipster.service.filter.ZonedDateTimeFilter;

/**
 * Criteria class for the {@link Bot} entity. This class is used
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

    public BotCriteria() {}

    public BotCriteria(BotCriteria other) {
        this.id = other.id == null ? null : other.id.copy();
        this.installationId = other.installationId == null ? null : other.installationId.copy();
        this.created = other.created == null ? null : other.created.copy();
        this.lastConnected = other.lastConnected == null ? null : other.lastConnected.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
    }

    @Override
    public BotCriteria copy() {
        return new BotCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getInstallationId() {
        return installationId;
    }

    public void setInstallationId(StringFilter installationId) {
        this.installationId = installationId;
    }

    public ZonedDateTimeFilter getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTimeFilter created) {
        this.created = created;
    }

    public ZonedDateTimeFilter getLastConnected() {
        return lastConnected;
    }

    public void setLastConnected(ZonedDateTimeFilter lastConnected) {
        this.lastConnected = lastConnected;
    }

    public LongFilter getUserId() {
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
        final BotCriteria that = (BotCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(installationId, that.installationId) &&
            Objects.equals(created, that.created) &&
            Objects.equals(lastConnected, that.lastConnected) &&
            Objects.equals(userId, that.userId)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, installationId, created, lastConnected, userId);
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
            "}";
    }
}
