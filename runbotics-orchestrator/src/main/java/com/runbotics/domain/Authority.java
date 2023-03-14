package com.runbotics.domain;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * An authority (a security role) used by Spring Security.
 */
@Entity
@Table(name = "jhi_authority")
public class Authority implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Size(max = 50)
    @Id
    @Column(length = 50)
    private String name;

    @ManyToMany
    @JoinTable(
        name = "authority_feature_key",
        joinColumns = { @JoinColumn(name = "authority", referencedColumnName = "name") },
        inverseJoinColumns = { @JoinColumn(name = "feature_key", referencedColumnName = "name") }
    )
    public Set<FeatureKey> featureKeys = new HashSet<>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<FeatureKey> getFeatureKeys() {
        return featureKeys;
    }

    public void setFeatureKeys(Set<FeatureKey> featureKeys) {
        this.featureKeys = featureKeys;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Authority)) {
            return false;
        }
        return Objects.equals(name, ((Authority) o).name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Authority{" +
            "name='" + name + '\'' +
            "}";
    }
}
