package com.runbotics.service.dto;

import com.runbotics.domain.User;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

public class ProcessCollectionDTO implements Serializable {

    private UUID id;

    private String name;

    private String description;

    private boolean isPublic;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    private UserDTO createdBy;

    private Set<User> users;

    private UUID parentId;

    public UUID getParentId() {
        return parentId;
    }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
    }

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

    public boolean getIsPublic() { return isPublic; }

    public void setIsPublic(boolean isPublic) { this.isPublic = isPublic; }

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
        ProcessCollectionDTO that = (ProcessCollectionDTO) o;
        return isPublic == that.isPublic && id.equals(that.id) && name.equals(that.name) && Objects.equals(description, that.description) && Objects.equals(created, that.created) && Objects.equals(updated, that.updated) && Objects.equals(createdBy, that.createdBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, isPublic, created, updated, createdBy);
    }

    @Override
    public String toString() {
        return "ProcessCollectionDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", isPublic=" + isPublic +
            ", parentId=" + parentId +
            ", created=" + created +
            ", updated=" + updated +
            ", createdBy=" + createdBy +
            ", users=" + users +
            '}';
    }
}
