package com.runbotics.service.dto;

import com.runbotics.domain.NotificationType;
import com.runbotics.domain.Process;
import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class NotificationProcessDTO implements Serializable {

    private Long id;
    private UserDTO user;
    private ProcessDTO process;
    private NotificationType type;
    private ZonedDateTime createdAt;

    public NotificationProcessDTO(Long id, UserDTO user, ProcessDTO process, NotificationType type, ZonedDateTime createdAt) {
        this.id = id;
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

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public ProcessDTO getProcess() {
        return process;
    }

    public void setProcess(ProcessDTO process) {
        this.process = process;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
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
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "NotificationProcessDTO{" +
            "id=" + id +
            ", userId=" + user.getId() +
            ", processId=" + process.getId() +
            ", createdAt=" + createdAt +
            ", type=" + type +
            '}';
    }
}
