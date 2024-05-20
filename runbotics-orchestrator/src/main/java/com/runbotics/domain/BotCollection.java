package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "bot_collection")
public class BotCollection implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotNull
    @Column(nullable = false, unique = true)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String description;

    @NotNull
    @Column(name = "public_bots_included")
    private boolean publicBotsIncluded;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "collection")
    @JsonIgnoreProperties(value = { "collection" }, allowSetters = true)
    private Set<Bot> bots = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "bot_collection_user",
        joinColumns = { @JoinColumn(name = "bot_collection_id", referencedColumnName = "id") },
        inverseJoinColumns = { @JoinColumn(name = "user_id", referencedColumnName = "id") }
    )
    @BatchSize(size = 20)
    private Set<User> users = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublicBotsIncluded() {
        return publicBotsIncluded;
    }

    public void setPublicBotsIncluded(boolean publicBotsIncluded) {
        this.publicBotsIncluded = publicBotsIncluded;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return updated;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Set<Bot> getBots() {
        return bots;
    }

    public void setBots(Set<Bot> bots) {
        this.bots = bots;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BotCollection that = (BotCollection) o;
        return id.equals(that.id) && name.equals(that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return (
            "BotCollection{" +
            "id=" +
            id +
            ", name='" +
            name +
            '\'' +
            ", description='" +
            description +
            '\'' +
            ", publicBotsIncluded=" +
            publicBotsIncluded +
            ", created=" +
            created +
            ", updated=" +
            updated +
            ", createdBy=" +
            createdBy +
            ", bots=" +
            bots +
            ", users=" +
            users +
            (tenant != null ? tenant.getId() : "") +
            '}'
        );
    }
}
