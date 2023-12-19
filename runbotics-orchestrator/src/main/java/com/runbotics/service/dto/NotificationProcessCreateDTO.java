package com.runbotics.service.dto;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class NotificationProcessCreateDTO implements Serializable {

    @NotNull
    private Long userId;

    @NotNull
    private Long processId;

    public NotificationProcessCreateDTO() {
    }

    public NotificationProcessCreateDTO(Long userId, Long processId) {
        this.userId = userId;
        this.processId = processId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotificationProcessCreateDTO that = (NotificationProcessCreateDTO) o;
        return Objects.equals(userId, that.userId) && Objects.equals(processId, that.processId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, processId);
    }

    @Override
    public String toString() {
        return "NotificationProcessCreateDTO{" +
            "userId=" + userId +
            ", processId=" + processId +
            '}';
    }
}
