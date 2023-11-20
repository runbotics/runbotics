package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.runbotics.modules.bot.entity.BotStatus;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A Bot.
 */
@Entity
@Table(name = "bot")
public class Bot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "installation_id", nullable = false, unique = true)
    private String installationId;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "last_connected")
    private ZonedDateTime lastConnected;

    @ManyToOne
    private User user;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private BotStatus status;

    @Column(name = "version")
    private String version;

    @ManyToOne
    @JoinColumn(name = "system")
    private BotSystem system;

    @ManyToOne
    @JoinColumn(name = "collection_id")
    private BotCollection collection;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bot id(Long id) {
        this.id = id;
        return this;
    }

    public String getInstallationId() {
        return this.installationId;
    }

    public Bot installationId(String installationId) {
        this.installationId = installationId;
        return this;
    }

    public void setInstallationId(String installationId) {
        this.installationId = installationId;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public Bot created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getLastConnected() {
        return this.lastConnected;
    }

    public Bot lastConnected(ZonedDateTime lastConnected) {
        this.lastConnected = lastConnected;
        return this;
    }

    public void setLastConnected(ZonedDateTime lastConnected) {
        this.lastConnected = lastConnected;
    }

    public User getUser() {
        return this.user;
    }

    public Bot user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public BotStatus getStatus() {
        return status;
    }

    public void setStatus(BotStatus status) {
        this.status = status;
    }

    public BotSystem getSystem() {
        return system;
    }

    public void setSystem(BotSystem system) {
        this.system = system;
    }

    public BotCollection getCollection() {
        return collection;
    }

    public void setCollection(BotCollection collection) {
        this.collection = collection;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Bot)) {
            return false;
        }
        return id != null && id.equals(((Bot) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Bot{" +
            "id=" + getId() +
            ", installationId='" + getInstallationId() + "'" +
            ", created='" + getCreated() + "'" +
            ", lastConnected='" + getLastConnected() + "'" +
            ", status='" + getStatus() + "'" +
            ", collection='" + getCollection().getId() + "'" +
            ", version='" + getVersion() + "'" +
            "}";
    }
}
