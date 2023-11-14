package com.runbotics.service.dto;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class NotificationProcessDTO implements Serializable {

    private Long id;
    private Long userId;
    private Long processId;
    private User user;
    private Process process;
    private String type;
    private ZonedDateTime createdAt;

    public NotificationProcessDTO(Long id, Long userId, Long processId, User user, Process process, String type, ZonedDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.processId = processId;
        this.user = user;
        this.process = process;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Process getProcess() {
        return process;
    }

    public void setProcess(Process process) {
        this.process = process;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotificationProcessDTO)) {
            return false;
        }
        return id != null && id.equals(((NotificationProcessDTO) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, processId);
    }

    @Override
    public String toString() {
        return "NotificationProcessDTO{" +
            "id=" + id +
            ", userId=" + userId +
            ", processId=" + processId +
            ", user=" + user +
            ", process=" + process +
            ", createdAt=" + createdAt +
            ", type=" + type +
            '}';
    }
}
