package com.runbotics.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ProcessInstanceAccessDenied extends RuntimeException {

    public ProcessInstanceAccessDenied(String message) {
        super(message);
    }

    public ProcessInstanceAccessDenied() {
        super("You do not have access to this process instance");
    }
}
