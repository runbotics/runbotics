package com.runbotics.domain;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "feature_key")
public class FeatureKey {

    @Id
    @Column(name = "name", length = 50)
    String name;

    public String getName() {
        return name;
    }

    public FeatureKey() {}

    public FeatureKey(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FeatureKey that = (FeatureKey) o;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
