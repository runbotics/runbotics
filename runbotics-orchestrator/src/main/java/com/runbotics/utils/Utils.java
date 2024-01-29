package com.runbotics.utils;

import com.runbotics.domain.BotCollectionConstants;

import java.util.List;
import java.util.Arrays;

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
}
