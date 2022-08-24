package com.runbotics.service.dto;

import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public class BotCollectionDTO implements Serializable {

    private UUID id;

    private String name;

    private String description;

    private boolean publicBotsIncluded;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    private UserDTO createdBy;

    private Set<User> users;

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

    public UserDTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserDTO createdBy) {
        this.createdBy = createdBy;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BotCollectionDTO that = (BotCollectionDTO) o;
        return publicBotsIncluded == that.publicBotsIncluded && id.equals(that.id) && name.equals(that.name) && Objects.equals(description, that.description) && Objects.equals(created, that.created) && Objects.equals(updated, that.updated) && Objects.equals(createdBy, that.createdBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, publicBotsIncluded, created, updated, createdBy);
    }

    @Override
    public String toString() {
        return "BotCollectionDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", publicBotsIncluded=" + publicBotsIncluded +
            ", created=" + created +
            ", updated=" + updated +
            ", createdBy=" + createdBy +
            ", users=" + users +
            '}';
    }
}
