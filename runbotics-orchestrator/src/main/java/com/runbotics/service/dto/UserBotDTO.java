package com.runbotics.service.dto;

import com.runbotics.domain.Bot;
import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

public class UserBotDTO implements Serializable {

    private Long userId;
    private Long botId;
    private User user;
    private Bot bot;
    private ZonedDateTime subscribedAt;

    public UserBotDTO(Long userId, Long botId, User user, Bot bot, ZonedDateTime subscribedAt) {
        this.userId = userId;
        this.botId = botId;
        this.user = user;
        this.bot = bot;
        this.subscribedAt = subscribedAt;
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

    public ZonedDateTime getSubscribedAt() {
        return subscribedAt;
    }

    public void setSubscribedAt(ZonedDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserBotDTO that = (UserBotDTO) o;
        return Objects.equals(userId, that.userId) && Objects.equals(botId, that.botId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, botId);
    }

    @Override
    public String toString() {
        return "UserBotDTO{" +
            "userId=" + userId +
            ", botId=" + botId +
            ", user=" + user +
            ", bot=" + bot +
            ", subscribedAt=" + subscribedAt +
            '}';
    }
}
