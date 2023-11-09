package com.runbotics.service.dto;

import com.runbotics.domain.Process;
import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class UserProcessDTO implements Serializable {

    private Long userId;
    private Long processId;
    private User user;
    private Process process;
    private ZonedDateTime subscribedAt;

    public UserProcessDTO(Long userId, Long processId, ZonedDateTime subscribedAt, User user, Process process) {
        this.userId = userId;
        this.processId = processId;
        this.subscribedAt = subscribedAt;
        this.user = user;
        this.process = process;
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
        return Objects.equals(userId, that.userId) && Objects.equals(processId, that.processId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, processId);
    }

    @Override
    public String toString() {
        return "UserProcessDTO{" +
            "userId=" + userId +
            ", processId=" + processId +
            ", subscribedAt=" + subscribedAt +
            ", user=" + user +
            ", process=" + process +
            '}';
    }
}
