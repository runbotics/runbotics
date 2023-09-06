package com.runbotics.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.runbotics.domain.GlobalVariable} entity.
 */
public class GlobalVariableDTO implements Serializable {

    private Long id;

    private String name;

    private String description;

    private String type;

    private String value;

    private ZonedDateTime lastModified;

    private UserDTO user;

    private UserDTO creator;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ZonedDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(ZonedDateTime lastModified) {
        this.lastModified = lastModified;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public UserDTO getCreator() {
        return creator;
    }

    public void setCreator(UserDTO user) {
        this.creator = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GlobalVariableDTO)) {
            return false;
        }

        GlobalVariableDTO globalVariableDTO = (GlobalVariableDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, globalVariableDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GlobalVariableDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", type='" + getType() + "'" +
            ", value='" + getValue() + "'" +
            ", lastModified='" + getLastModified() + "'" +
            ", user=" + getUser() +
            ", creator=" + getCreator() +
            "}";
    }
}
