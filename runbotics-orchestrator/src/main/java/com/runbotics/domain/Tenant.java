package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenants")
public class Tenant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotNull
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "createdBy", nullable = false)
    private User createdBy;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "updated")
    private ZonedDateTime updated;

    @LastModifiedBy
    @Column(name = "last_modified_by", length = 50)
    @JsonIgnore
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    @JsonIgnore
    private Instant lastModifiedDate = Instant.now();
}
