package com.runbotics.service.dto;

import com.runbotics.domain.Bot;
import com.runbotics.domain.NotificationType;
import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class NotificationBotDTO implements Serializable {

    private Long id;
    private User user;
    private Bot bot;
    private NotificationType type;
    private ZonedDateTime createdAt;

    public NotificationBotDTO(Long id, User user, Bot bot, NotificationType type, ZonedDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.bot = bot;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bot getBot() {
        return bot;
    }

    public void setBot(Bot bot) {
        this.bot = bot;
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
        if (!(o instanceof NotificationBotDTO)) {
            return false;
        }
        return id != null && id.equals(((NotificationBotDTO) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "NotificationBotDTO{" +
            "id=" + id +
            ", user=" + user +
            ", bot=" + bot +
            ", createdAt=" + createdAt +
            ", type=" + type +
            '}';
    }
}
