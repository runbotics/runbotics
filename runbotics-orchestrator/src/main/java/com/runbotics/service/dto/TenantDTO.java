package com.runbotics.service.dto;

import com.runbotics.domain.Tenant;

import java.time.ZonedDateTime;
import java.util.UUID;

public class TenantDTO {

    private UUID id;

    private String name;

    private UserDTO createdBy;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    private String lastModifiedBy;
    public TenantDTO() {}

    public TenantDTO(Tenant tenant) {
        this.id = tenant.getId();
        this.name = tenant.getName();
        this.createdBy = new UserDTO(tenant.getCreatedBy());
        this.created = tenant.getCreated();
        this.updated = tenant.getUpdated();
    }

    public UUID getId() {
        return this.id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserDTO getCreatedBy() {
        return this.createdBy;
    }

    public void setCreatedBy(UserDTO createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return this.updated;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public String getLastModifiedBy() {
        return this.lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TenantDTO)) {
            return false;
        }
        return id != null && id.equals(((TenantDTO) o).id);
    }

    @Override
    public String toString() {
        return "TenantDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", createdById=" + createdBy +
            ", created=" + created +
            ", updated=" + updated +
            ", lastModifiedBy" + lastModifiedBy +
            "}";
    }
}
