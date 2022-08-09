package com.runbotics.service.dto;

import com.runbotics.domain.Authority;
import com.runbotics.domain.FeatureKey;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.constraints.Size;

public class AuthorityDTO {

    @Size(max = 50)
    private String name;

    private Set<String> featureKeys;

    public AuthorityDTO(Authority authority) {
        this.name = authority.getName();
        this.featureKeys = authority.getFeatureKeys().stream().map(FeatureKey::getName).collect(Collectors.toSet());
    }

    public String getName() {
        return name;
    }

    public Set<String> getFeatureKeys() {
        return featureKeys;
    }
}
