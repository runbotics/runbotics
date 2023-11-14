package com.runbotics.service.dto;

import com.runbotics.domain.Bot;
import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class NotificationBotDTO implements Serializable {

    private Long id;
    private Long userId;
    private Long botId;
    private User user;
    private Bot bot;
    private String type;
    private ZonedDateTime createdAt;

    public NotificationBotDTO(Long id, Long userId, Long botId, User user, Bot bot, String type, ZonedDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.botId = botId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBotId() {
        return botId;
    }

    public void setBotId(Long botId) {
        this.botId = botId;
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
        if (!(o instanceof NotificationBotDTO)) {
            return false;
        }
        return id != null && id.equals(((NotificationBotDTO) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, botId);
    }

    @Override
    public String toString() {
        return "NotificationBotDTO{" +
            "id=" + id +
            ", userId=" + userId +
            ", botId=" + botId +
            ", user=" + user +
            ", bot=" + bot +
            ", createdAt=" + createdAt +
            ", type=" + type +
            '}';
    }
}
