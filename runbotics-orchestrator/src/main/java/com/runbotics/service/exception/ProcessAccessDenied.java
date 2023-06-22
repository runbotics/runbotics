package com.runbotics.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ProcessAccessDenied extends RuntimeException {

    public ProcessAccessDenied(String message) {
        super(message);
    }

    public ProcessAccessDenied() {
        super("You do not have access to this process");
    }
}
