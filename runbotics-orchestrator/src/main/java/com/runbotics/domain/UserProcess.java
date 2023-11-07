package com.runbotics.domain;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Entity
@Table(name = "jhi_user_process")
public class UserProcess implements Serializable {

    public UserProcess() {
    }

    public UserProcess(User user, Process process, ZonedDateTime subscribedAt) {
        this.user = user;
        this.process = process;
        this.subscribedAt = subscribedAt;
        this.id = new UserProcessPK(user.getId(), process.getId());
    }

    @EmbeddedId
    private UserProcessPK id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @MapsId("userId")
    private User user;

    @ManyToOne
    @JoinColumn(name = "process_id")
    @MapsId("processId")
    private Process process;

    @Column(name = "subscribed_at")
    private ZonedDateTime subscribedAt;

    public UserProcessPK getId() {
        return id;
    }

    public void setId(UserProcessPK id) {
        this.id = id;
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

    public ZonedDateTime getSubscribedAt() {
        return subscribedAt;
    }

    public void setSubscribedAt(ZonedDateTime subscribedAt) {
        this.subscribedAt = subscribedAt;
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProcess)) {
            return false;
        }
        return id != null && id.equals(((UserProcess) o).id);
    }
}
