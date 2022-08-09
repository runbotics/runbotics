package com.runbotics.security;

import com.runbotics.domain.Authority;
import com.runbotics.domain.FeatureKey;
import com.runbotics.domain.User;
import com.runbotics.service.UserService;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("securityService")
public class SecurityService {

    private final Logger log = LoggerFactory.getLogger(SecurityService.class);
    private final UserService userService;

    public SecurityService(final UserService userService) {
        this.userService = userService;
    }

    @Transactional
    public boolean checkFeatureKeyAccess(String featureKey) {
        User currentUser = userService.getUserWithAuthorities().orElseGet(User::new);
        log.info("Checking if user {} has access to feature key {}", currentUser.getLogin(), featureKey);
        boolean isAllowed = currentUser
            .getAuthorities()
            .stream()
            .map(Authority::getFeatureKeys)
            .flatMap(Set::stream)
            .map(FeatureKey::getName)
            .collect(Collectors.toSet())
            .contains(featureKey);
        if (!isAllowed) {
            log.warn("Access denied: User {} doesn't have feature key {}", currentUser.getLogin(), featureKey);
        }
        return isAllowed;
    }
}
