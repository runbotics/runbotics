package com.runbotics.security;

import org.springframework.security.core.AuthenticationException;

public class TenantNotActivatedException extends AuthenticationException {
    private static final long serialVersionUID = 1L;

    public TenantNotActivatedException(String message) {
        super(message);
    }
}
