package com.runbotics.utils;

import com.runbotics.domain.BotCollectionConstants;
import com.runbotics.domain.Tenant;

import java.util.List;
import java.util.Arrays;
import java.util.UUID;

/**
 * General utility class.
 */
public final class Utils {
    private Utils() {}

    public static List<String> getCommonBotCollections() {
        return Arrays.asList(
            BotCollectionConstants.PUBLIC_COLLECTION,
            BotCollectionConstants.GUEST_COLLECTION
        );
    }

    public static Tenant getDefaultTenant() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.fromString("b7f9092f-5973-c781-08db-4d6e48f78e98"));
        return tenant;
    }
}
