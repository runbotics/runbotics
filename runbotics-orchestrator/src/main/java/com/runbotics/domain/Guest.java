package com.runbotics.domain;

import javax.persistence.*;
import java.util.Objects;

@Entity(name = "guest")
public class Guest {
    @Id
    @Column(name = "ip", length = 100)
    String ip;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "executions_count")
    private int executionsCount;

    public Guest() {
    }

    public Guest(String ip, User user, int executionsCount) {
        this.ip = ip;
        this.user = user;
        this.executionsCount = executionsCount;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getExecutionsCount() {
        return executionsCount;
    }

    public void setExecutionsCount(int executionsCount) {
        this.executionsCount = executionsCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Guest)) return false;
        Guest guest = (Guest) o;
        return executionsCount == guest.executionsCount && Objects.equals(ip, guest.ip) && Objects.equals(user, guest.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ip, user, executionsCount);
    }

    @Override
    public String toString() {
        return "Guest{" +
            "ip='" + ip + '\'' +
            ", user=" + user +
            ", executionsCount=" + executionsCount +
            '}';
    }
}
