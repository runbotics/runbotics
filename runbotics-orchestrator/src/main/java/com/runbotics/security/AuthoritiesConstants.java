package com.runbotics.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String TENANT_ADMIN = "ROLE_TENANT_ADMIN";

    public static final String RPA_USER = "ROLE_RPA_USER";

    public static final String EXTERNAL_USER = "ROLE_EXTERNAL_USER";

    public static final String USER = "ROLE_USER";

    public static final String GUEST = "ROLE_GUEST";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {}
}
