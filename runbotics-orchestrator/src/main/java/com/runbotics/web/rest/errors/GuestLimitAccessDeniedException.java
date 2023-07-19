package com.runbotics.web.rest.errors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class GuestLimitAccessDeniedException extends RuntimeException {
    public GuestLimitAccessDeniedException() {
        super("Limit exceeded");
    }
}
