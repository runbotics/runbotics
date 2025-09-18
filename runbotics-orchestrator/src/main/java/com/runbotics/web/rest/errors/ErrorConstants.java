package com.runbotics.web.rest.errors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public final class ErrorConstants {

    private static String applicationUrl;

    public static String ERR_CONCURRENCY_FAILURE = "error.concurrencyFailure";
    public static String ERR_VALIDATION = "error.validation";

    public static URI DEFAULT_TYPE;
    public static URI CONSTRAINT_VIOLATION_TYPE;
    public static URI INVALID_PASSWORD_TYPE;
    public static URI EMAIL_ALREADY_USED_TYPE;
    public static URI LOGIN_ALREADY_USED_TYPE;
    public static URI BOT_NOT_FOUND_TYPE;
    public static URI PROCESS_NOT_FOUND_TYPE;

    private ErrorConstants() {}

    @Value("${application.url}")
    public void setApplicationUrl(String url) {
        applicationUrl = url;

        DEFAULT_TYPE = URI.create(url + "/problem-with-message");
        CONSTRAINT_VIOLATION_TYPE = URI.create(url + "/constraint-violation");
        INVALID_PASSWORD_TYPE = URI.create(url + "/invalid-password");
        EMAIL_ALREADY_USED_TYPE = URI.create(url + "/email-already-used");
        LOGIN_ALREADY_USED_TYPE = URI.create(url + "/login-already-used");
        BOT_NOT_FOUND_TYPE = URI.create(url + "/bot-not-found");
        PROCESS_NOT_FOUND_TYPE = URI.create(url + "/process-not-found");
    }

    public static String getApplicationUrl() {
        return applicationUrl;
    }
}
