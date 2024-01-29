package com.runbotics.service.dto;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

public class NotificationBotCreateDTO implements Serializable {

    @NotNull
    private Long userId;

    @NotNull
    private Long botId;

    public NotificationBotCreateDTO() {
    }

    public NotificationBotCreateDTO(Long userId, Long botId) {
        this.userId = userId;
        this.botId = botId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NotificationBotCreateDTO that = (NotificationBotCreateDTO) o;
        return Objects.equals(userId, that.userId) && Objects.equals(botId, that.botId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, botId);
    }

    @Override
    public String toString() {
        return "NotificationBotCreateDTO{" +
            "userId=" + userId +
            ", botId=" + botId +
            '}';
    }
}
