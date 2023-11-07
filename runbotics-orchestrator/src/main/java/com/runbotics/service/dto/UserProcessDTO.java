package com.runbotics.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class UserProcessDTO implements Serializable {

    private Long userId;
    private Long processId;
    private ZonedDateTime subscribedAt;

    public UserProcessDTO(Long userId, Long processId, ZonedDateTime subscribedAt) {
        this.userId = userId;
        this.processId = processId;
        this.subscribedAt = subscribedAt;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setSubscribedAt(ZonedDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }

    public ZonedDateTime getSubscribedAt() {
        return subscribedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProcessDTO that = (UserProcessDTO) o;
        return Objects.equals(userId, that.userId) && Objects.equals(processId, that.processId) && Objects.equals(subscribedAt, that.subscribedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, processId, subscribedAt);
    }

    @Override
    public String toString() {
        return "ProcessNotificationDTO{" +
            "userId=" + userId +
            ", processId=" + processId +
            ", subscribedAt=" + subscribedAt +
            '}';
    }
}
