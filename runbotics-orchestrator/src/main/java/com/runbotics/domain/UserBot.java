package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

@Entity
@Table(name = "jhi_user_bot")
public class UserBot implements Serializable {

    public UserBot() {
    }

    public UserBot(UserBotPK id, User user, Bot bot, ZonedDateTime subscribedAt) {
        this.id = id;
        this.user = user;
        this.bot = bot;
        this.subscribedAt = subscribedAt;
    }

    @EmbeddedId
    private UserBotPK id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    @MapsId("userId")
    private User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "bot_id")
    @MapsId("botId")
    private Bot bot;

    @Column(name = "subscribed_at")
    private ZonedDateTime subscribedAt;

    public UserBotPK getId() {
        return id;
    }

    public void setId(UserBotPK id) {
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

    public ZonedDateTime getSubscribedAt() {
        return subscribedAt;
    }

    public void setSubscribedAt(ZonedDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserBot)) {
            return false;
        }
        return id != null && id.equals(((UserBot) o).id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, user, bot, subscribedAt);
    }
}
