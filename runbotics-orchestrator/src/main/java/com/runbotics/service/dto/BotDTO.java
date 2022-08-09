package com.runbotics.service.dto;

import com.runbotics.domain.BotSystem;
import com.runbotics.modules.bot.entity.BotStatus;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.runbotics.domain.Bot} entity.
 */
public class BotDTO implements Serializable {

    private Long id;

    @NotNull
    private String installationId;

    private ZonedDateTime created;

    private ZonedDateTime lastConnected;

    private UserDTO user;

    private BotStatus status;

    private String version;

    private BotSystem system;

    private BotCollectionDTO collection;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInstallationId() {
        return installationId;
    }

    public void setInstallationId(String installationId) {
        this.installationId = installationId;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getLastConnected() {
        return lastConnected;
    }

    public void setLastConnected(ZonedDateTime lastConnected) {
        this.lastConnected = lastConnected;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public BotStatus getStatus() {
        return status;
    }

    public void setStatus(BotStatus status) {
        this.status = status;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public BotSystem getSystem() {
        return system;
    }

    public void setSystem(BotSystem system) {
        this.system = system;
    }

    public BotCollectionDTO getCollection() {
        return collection;
    }

    public void setCollection(BotCollectionDTO collection) {
        this.collection = collection;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BotDTO)) {
            return false;
        }

        BotDTO botDTO = (BotDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, botDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "BotDTO{" +
            "id=" + id +
            ", installationId='" + installationId + '\'' +
            ", created=" + created +
            ", lastConnected=" + lastConnected +
            ", user=" + user +
            ", status=" + status +
            ", version=" + version +
            ", system=" + system +
            ", collection=" + collection +
            '}';
    }
}
