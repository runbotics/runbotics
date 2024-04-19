package com.runbotics.domain;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "process_collection")
public class ProcessCollection implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column()
    private UUID parentId;

    @NotNull
    @Column(nullable = false)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String description;

    private ZonedDateTime created;

    private ZonedDateTime updated;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(nullable = false)
    private Boolean isPublic;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "process_collection_user",
        joinColumns = { @JoinColumn(name = "collection_id", referencedColumnName = "id") },
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

    public Boolean getIsPublic() { return this.isPublic; }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public UUID getParentId() { return this.parentId; }

    public void setParentId(UUID parentId) {
        this.parentId = parentId;
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
    public String toString() {
        return (
            "ProcessCollection {" +
            "id=" +
            id +
            ", name='" +
            name +
            '\'' +
            ", description='" +
            description +
            '\'' +
            ", created=" +
            created +
            ", updated=" +
            updated +
            ", createdBy=" +
            createdBy +
            ", parentId =" +
            parentId +
            ", users=" +
            users +
            ", tenantId=" +
            (tenant != null ? tenant.getId() : "") +
            '}'
        );
    }
}
