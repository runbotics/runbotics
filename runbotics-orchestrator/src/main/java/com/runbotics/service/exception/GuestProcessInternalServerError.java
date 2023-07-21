package com.runbotics.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class GuestProcessInternalServerError extends RuntimeException {
    public GuestProcessInternalServerError(String message) {
        super(message);
    }

    public GuestProcessInternalServerError() {
        super("Unexpected guest process exception occurred");
    }
}
