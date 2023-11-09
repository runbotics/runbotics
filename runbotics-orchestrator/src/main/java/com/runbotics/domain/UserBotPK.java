package com.runbotics.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class UserBotPK implements Serializable {

    @Column(name = "user_id")
    Long userId;

    @Column(name = "bot_id")
    Long botId;

    public UserBotPK() {
    }

    public UserBotPK(Long userId, Long botId) {
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
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserBotPK)) {
            return false;
        }
        return (userId != null && userId.equals(((UserBotPK) o).userId)) &&
            (botId != null && botId.equals(((UserBotPK) o).botId));
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, botId);
    }
}
